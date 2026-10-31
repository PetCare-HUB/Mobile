import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';

import type { AlertaSaudeResponse } from '../../types/api';
import { TIPO_LABEL } from '../../utils/alertMappers';

const CANAL_ANDROID = 'alertas-saude';

type ModuloNotificacoes = typeof import('expo-notifications');

/**
 * O expo-notifications e carregado por require dentro de funcao, nao por import
 * no topo, de proposito. O index.js dele re-exporta o topicSubscription, que
 * pede o modulo nativo ExpoTopicSubscriptionModule -- e esse modulo nao existe
 * no Expo Go desde o SDK 53. Com import estatico o erro sobe na avaliacao deste
 * arquivo e derruba o app inteiro em vez de só a notificacao, porque o
 * _layout.tsx importa o hook no topo.
 *
 * Carregar tarde, porem, nao basta: ver em carregar() por que o require precisa
 * ser evitado, e nao apenas protegido. No Expo Go o recurso fica desligado; no
 * dev build e no APK o modulo esta presente e tudo funciona.
 */
let modulo: ModuloNotificacoes | null = null;
let tentouCarregar = false;

/** O que este arquivo de fato chama no pacote. */
const MEMBROS_USADOS = [
  'setNotificationHandler',
  'setNotificationChannelAsync',
  'getPermissionsAsync',
  'requestPermissionsAsync',
  'scheduleNotificationAsync',
  'addNotificationResponseReceivedListener',
] as const;

/**
 * Nao basta o require nao lancar. O require pode voltar undefined, ou um objeto
 * incompleto, porque o index.js do pacote nao termina de avaliar quando o
 * modulo nativo falta -- e aí o erro reaparece na primeira chamada, nao no
 * carregamento. Por isso o que volta e conferido antes de ser usado.
 */
function utilizavel(candidato: unknown): candidato is ModuloNotificacoes {
  if (candidato == null || typeof candidato !== 'object') return false;

  const alvo = candidato as Record<string, unknown>;
  if (typeof alvo.AndroidImportance !== 'object' || alvo.AndroidImportance == null) return false;

  return MEMBROS_USADOS.every((membro) => typeof alvo[membro] === 'function');
}

function carregar(): ModuloNotificacoes | null {
  if (tentouCarregar) return modulo;
  tentouCarregar = true;

  // Decidido ANTES de requerer, e nao com try/catch em volta do require, porque
  // try/catch nao funciona aqui: quando a avaliacao do pacote falha, o
  // guardedLoadModule do Metro chama ErrorUtils.reportFatalError(e) em vez de
  // relancar, mostra a tela vermelha e devolve undefined. Ou seja, a excecao
  // nunca chega ao nosso catch. E a mesma checagem que o index.js do
  // expo-notifications faz na primeira linha, e ela e barata e segura: o
  // isRunningInExpoGo embrulha o proprio requireNativeModule em try/catch
  // dentro do modulo, entao nada escapa para o guard.
  if (isRunningInExpoGo()) return null;

  try {
    const candidato: unknown = require('expo-notifications');
    if (!utilizavel(candidato)) return null;

    // Com o app em primeiro plano o sistema entrega a notificacao ao JS e, sem
    // este handler, nao desenha nada. Como o alerta que dispara aqui e sempre
    // de nivel ALTO ou CRITICO, ele aparece como banner, entra na central e
    // toca.
    candidato.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    modulo = candidato;
  } catch {
    modulo = null;
  }

  return modulo;
}

/**
 * No Android a importancia do canal e que decide se a notificacao aparece como
 * banner; definir só a prioridade na notificacao nao basta. O canal precisa
 * existir antes do primeiro disparo, por isso isso roda no boot do app.
 */
export async function prepararCanal(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const notificacoes = carregar();
  if (!notificacoes) return;

  await notificacoes.setNotificationChannelAsync(CANAL_ANDROID, {
    name: 'Alertas de saude',
    importance: notificacoes.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });
}

/**
 * Pede a permissao de notificacao, se ainda nao houver. Devolve false quando o
 * usuario nega -- nesse caso o app segue funcionando normalmente, só sem avisar
 * nada, e nao insiste a cada abertura (o sistema nao reexibe o dialogo).
 *
 * Devolve false tambem quando o runtime nao tem o modulo nativo, e e isso que
 * mantem o resto do recurso desligado no Expo Go.
 */
export async function garantirPermissao(): Promise<boolean> {
  const notificacoes = carregar();
  if (!notificacoes) return false;

  const atual = await notificacoes.getPermissionsAsync();
  if (atual.granted) return true;
  if (!atual.canAskAgain) return false;

  const pedida = await notificacoes.requestPermissionsAsync();
  return pedida.granted;
}

/**
 * Dispara a notificacao local do alerta. `trigger: null` entrega na hora, sem
 * agendamento.
 *
 * O `data` leva o id do alerta para a tela de detalhe conseguir abrir o alerta
 * certo quando o usuario toca na notificacao.
 */
export async function notificarAlerta(alerta: AlertaSaudeResponse): Promise<void> {
  const notificacoes = carregar();
  if (!notificacoes) return;

  await notificacoes.scheduleNotificationAsync({
    content: {
      title: `${alerta.petNome}: ${TIPO_LABEL[alerta.tipo]}`,
      body: alerta.mensagem,
      sound: 'default',
      data: { alertaId: alerta.id, petId: alerta.petId },
    },
    trigger: null,
  });
}

/**
 * Registra o toque na notificacao e devolve a funcao que cancela a inscricao.
 * Fica aqui, e nao no hook, para que o expo-notifications tenha um unico ponto
 * de entrada guardado no app.
 */
export function aoTocarNotificacao(acao: (alertaId: number) => void): () => void {
  const notificacoes = carregar();
  if (!notificacoes) return () => {};

  const inscricao = notificacoes.addNotificationResponseReceivedListener((resposta) => {
    const alertaId = resposta.notification.request.content.data?.alertaId;
    if (typeof alertaId === 'number') {
      acao(alertaId);
    }
  });

  return () => inscricao.remove();
}
