import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import type { AlertaSaudeResponse } from '../../types/api';
import { TIPO_LABEL } from '../../utils/alertMappers';

const CANAL_ANDROID = 'alertas-saude';

// Com o app em primeiro plano o sistema entrega a notificacao ao JS e, sem
// este handler, nao desenha nada. Como o alerta que dispara aqui e sempre de
// nivel ALTO ou CRITICO, ele aparece como banner, entra na central e toca.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * No Android a importancia do canal e que decide se a notificacao aparece como
 * banner; definir só a prioridade na notificacao nao basta. O canal precisa
 * existir antes do primeiro disparo, por isso isso roda no boot do app.
 */
export async function prepararCanal(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(CANAL_ANDROID, {
    name: 'Alertas de saude',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });
}

/**
 * Pede a permissao de notificacao, se ainda nao houver. Devolve false quando o
 * usuario nega -- nesse caso o app segue funcionando normalmente, só sem avisar
 * nada, e nao insiste a cada abertura (o sistema nao reexibe o dialogo).
 */
export async function garantirPermissao(): Promise<boolean> {
  const atual = await Notifications.getPermissionsAsync();
  if (atual.granted) return true;
  if (!atual.canAskAgain) return false;

  const pedida = await Notifications.requestPermissionsAsync();
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
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${alerta.petNome}: ${TIPO_LABEL[alerta.tipo]}`,
      body: alerta.mensagem,
      sound: 'default',
      data: { alertaId: alerta.id, petId: alerta.petId },
    },
    trigger: null,
  });
}
