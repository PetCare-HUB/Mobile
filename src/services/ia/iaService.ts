import { apiRequest } from '../api/client';
import type { AnaliseIaResponse, PerguntaIaRequest } from '../../types/ia';

/**
 * O limite do backend (app.ia.pergunta.max-caracteres). A tela usa o mesmo
 * numero para barrar antes de gastar uma chamada ao Gemini.
 */
export const LIMITE_PERGUNTA = 500;

/**
 * Teto generoso de proposito. No pior caso a chamada soma o cold start do
 * Render com o tempo do proprio backend, que tenta o Gemini duas vezes com
 * 60s cada (app.ia.timeout-ms x app.ia.tentativas).
 */
const TIMEOUT_MS = 120_000;

/**
 * Nao usa requestWithColdStartRetry: responder uma pergunta grava uma linha
 * em ANALISE_IA, entao repetir sozinho depois de um timeout geraria uma
 * segunda analise -- e cobraria duas vezes do Gemini. Se falhar, quem decide
 * tentar de novo e o tutor, tocando "Perguntar".
 */
export async function perguntarIa(
  token: string,
  petId: number,
  pergunta: string
): Promise<AnaliseIaResponse> {
  const body: PerguntaIaRequest = { pergunta };

  return apiRequest<AnaliseIaResponse>(`/pets/${petId}/ia/perguntar`, {
    method: 'POST',
    token,
    timeoutMs: TIMEOUT_MS,
    body: JSON.stringify(body),
  });
}
