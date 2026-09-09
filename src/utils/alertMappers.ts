import type { AlertaNivel, AlertaSaudeResponse, AlertaTipo } from '../types/api';
import type { AlertItem } from '../types/pet';
import { formatTimeAgo } from './formatters';

export const NIVEL_TO_SEVERITY: Record<AlertaNivel, AlertItem['severity']> = {
  BAIXO: 'low',
  MEDIO: 'medium',
  ALTO: 'high',
  CRITICO: 'high',
};

export const TIPO_LABEL: Record<AlertaTipo, string> = {
  BATERIA_COLEIRA_BAIXA: 'Bateria da coleira baixa',
  RACAO_BAIXA: 'Ração baixa',
  BAIXA_ALIMENTACAO: 'Baixa alimentação',
  AMBIENTE_RUIM: 'Ambiente inadequado',
  TEMPERATURA_FORA_DA_FAIXA: 'Temperatura fora da faixa ideal',
  UMIDADE_FORA_DA_FAIXA: 'Umidade fora da faixa ideal',
  SCORE_CRITICO: 'Score de saúde crítico',
  CONSULTA_ATRASADA: 'Consulta atrasada',
  SCORE_BAIXO: 'Score de saúde baixo',
  ATIVIDADE_BAIXA: 'Atividade baixa',
};

export function alertToUiShape(alert: AlertaSaudeResponse): AlertItem {
  return {
    id: alert.id,
    title: TIPO_LABEL[alert.tipo],
    message: alert.mensagem,
    severity: NIVEL_TO_SEVERITY[alert.nivel],
    timeAgo: formatTimeAgo(alert.dataAlerta),
  };
}
