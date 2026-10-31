import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICADOS_KEY = '@petcarehub:alertas-notificados';

// O endpoint de alertas ativos e consultado de novo a cada minuto enquanto o
// app esta aberto, e devolve os mesmos alertas enquanto ninguem os resolve.
// Sem guardar o que ja foi avisado, o mesmo alerta notificaria em loop. A
// lista fica no AsyncStorage porque precisa sobreviver ao fechamento do app.
const LIMITE = 200;

/**
 * `null` significa "nunca rodou neste dispositivo" -- diferente de lista vazia,
 * que significa "rodou e nao havia nada para avisar". A distincao importa: na
 * primeira execucao os alertas que ja estavam abertos no servidor nao sao
 * novidade para o usuario, e notificar todos de uma vez seria spam.
 */
export async function getAlertasNotificados(): Promise<number[] | null> {
  try {
    const data = await AsyncStorage.getItem(NOTIFICADOS_KEY);
    if (!data) return null;

    const lido: unknown = JSON.parse(data);
    if (!Array.isArray(lido)) return null;

    return lido.filter((id): id is number => typeof id === 'number');
  } catch {
    // Storage corrompido se comporta como primeira execucao: refaz a linha de
    // base em vez de notificar alertas antigos.
    return null;
  }
}

export async function setAlertasNotificados(ids: number[]): Promise<void> {
  try {
    // Mantem os mais recentes. Os ids vem do Oracle (sequence crescente), entao
    // o maior id e sempre o alerta mais novo.
    const recentes = [...ids].sort((a, b) => b - a).slice(0, LIMITE);
    await AsyncStorage.setItem(NOTIFICADOS_KEY, JSON.stringify(recentes));
  } catch (error) {
    console.log('Erro ao salvar alertas notificados:', error);
  }
}
