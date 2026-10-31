import { requestWithColdStartRetry } from '../api/client';
import type { PerguntaIaRequest, RespostaIaResponse } from '../../types/ia';

/**
 * A IA e um servico separado da API Java, entao tem URL propria. Enquanto a
 * variavel nao existe, `iaDisponivel` e false e a tela mostra isso em vez de
 * tentar uma chamada que falharia.
 *
 * Nao ha fallback aqui de proposito: apontar para a API Java por padrao faria
 * a tela dar 404 em producao sem ninguem perceber.
 */
export const IA_BASE_URL = process.env.EXPO_PUBLIC_IA_API_URL ?? '';

export const iaDisponivel = IA_BASE_URL.length > 0;

export async function perguntarIa(
  token: string,
  petId: number,
  pergunta: string
): Promise<RespostaIaResponse> {
  const body: PerguntaIaRequest = { pergunta };

  // Usa o retry de cold start porque o servico de IA deve subir no mesmo
  // plano gratuito do Render que a API Java -- a primeira chamada depois de
  // um tempo parado leva dezenas de segundos.
  return requestWithColdStartRetry<RespostaIaResponse>(`/api/ia/pets/${petId}/perguntas`, {
    method: 'POST',
    token,
    baseUrl: IA_BASE_URL,
    body: JSON.stringify(body),
  });
}
