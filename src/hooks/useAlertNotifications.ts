import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

import { useAuth } from '../contexts/auth/AuthContext';
import { usePetContext } from '../contexts/pet/PetContext';
import { getPetAlerts } from '../services/pets/petsService';
import {
  garantirPermissao,
  notificarAlerta,
  prepararCanal,
} from '../services/notifications/notificationService';
import {
  getAlertasNotificados,
  setAlertasNotificados,
} from '../storage/notifiedAlertsStorage';
import { getPreferences } from '../storage/preferencesStorage';
import { petKeys } from './queries/queryKeys';
import type { AlertaSaudeResponse } from '../types/api';

// De quanto em quanto tempo os alertas ativos sao reconsultados enquanto o app
// esta aberto. E isso que faz a notificacao chegar sem o usuario navegar: o
// SCORE_CRITICO nasce no Java (ScoreSaudeService, quando o score cai abaixo de
// 50) e aparece aqui no ciclo seguinte.
const INTERVALO_MS = 60_000;

/** Só alerta o que o backend classificou como grave. */
function merecerNotificacao(alerta: AlertaSaudeResponse): boolean {
  return !alerta.resolvido && (alerta.nivel === 'ALTO' || alerta.nivel === 'CRITICO');
}

/**
 * Observa os alertas ativos de todos os pets do tutor e dispara uma notificacao
 * local para cada alerta grave que ainda nao foi avisado neste dispositivo.
 *
 * O disparo e sempre consequencia de um alerta criado pelo backend -- nao existe
 * caminho no app para forcar uma notificacao manualmente.
 */
export function useAlertNotifications() {
  const { token, isAuthenticated } = useAuth();
  const { pets } = usePetContext();
  const router = useRouter();

  const [habilitado, setHabilitado] = useState(false);

  // Dois ciclos concorrentes poderiam ler o storage antes de qualquer um
  // escrever e notificar o mesmo alerta duas vezes. A fila serializa os
  // disparos -- descartar o ciclo mais novo nao serve, porque a assinatura nao
  // muda de novo e o alerta ficaria sem aviso.
  const fila = useRef<Promise<void>>(Promise.resolve());
  // Barreira sincrona: o storage e assincrono, isto nao e.
  const notificadosNaSessao = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      setHabilitado(false);
      return;
    }

    let ativo = true;

    (async () => {
      const { notifAlertas } = await getPreferences();
      if (!notifAlertas) return;

      await prepararCanal();
      const permitido = await garantirPermissao();
      if (ativo) setHabilitado(permitido);
    })();

    return () => {
      ativo = false;
    };
  }, [isAuthenticated]);

  // Um toque na notificacao abre o alerta que a originou.
  useEffect(() => {
    const inscricao = Notifications.addNotificationResponseReceivedListener((resposta) => {
      const alertaId = resposta.notification.request.content.data?.alertaId;
      if (typeof alertaId === 'number') {
        router.push(`/alertas/${alertaId}`);
      }
    });

    return () => inscricao.remove();
  }, [router]);

  // Mesma queryKey que a usePetAlerts das telas: o cache e compartilhado, nao
  // ha requisicao duplicada. O refetchInterval aqui e o que mantem o cache
  // fresco mesmo quando nenhuma tela de alerta esta aberta.
  const resultados = useQueries({
    queries: pets.map((pet) => ({
      queryKey: petKeys.alerts(pet.id),
      queryFn: () => getPetAlerts(token as string, pet.id),
      enabled: Boolean(token) && habilitado,
      refetchInterval: INTERVALO_MS,
    })),
  });

  const graves = useMemo(
    () => resultados.flatMap((resultado) => resultado.data ?? []).filter(merecerNotificacao),
    [resultados]
  );

  // `graves` e um array novo a cada render; a assinatura abaixo só muda quando o
  // conjunto de alertas muda de verdade, e é ela que governa o efeito.
  const assinatura = graves
    .map((alerta) => alerta.id)
    .sort((a, b) => a - b)
    .join(',');

  useEffect(() => {
    if (!habilitado) return;

    fila.current = fila.current
      .then(async () => {
        const jaNotificados = await getAlertasNotificados();
        const idsAtuais = graves.map((alerta) => alerta.id);

        // Primeira execucao no dispositivo: registra o que ja existia como
        // linha de base, sem notificar nada.
        if (jaNotificados === null) {
          idsAtuais.forEach((id) => notificadosNaSessao.current.add(id));
          await setAlertasNotificados(idsAtuais);
          return;
        }

        const novos = graves.filter(
          (alerta) =>
            !jaNotificados.includes(alerta.id) && !notificadosNaSessao.current.has(alerta.id)
        );
        if (novos.length === 0) return;

        for (const alerta of novos) {
          notificadosNaSessao.current.add(alerta.id);
          await notificarAlerta(alerta);
        }

        await setAlertasNotificados([...jaNotificados, ...idsAtuais]);
      })
      // Um erro aqui nao pode envenenar a fila: o proximo ciclo precisa rodar.
      .catch((error) => {
        console.log('Erro ao notificar alertas:', error);
      });
  }, [assinatura, habilitado]);
}
