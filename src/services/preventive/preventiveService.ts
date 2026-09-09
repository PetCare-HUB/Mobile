import { requestWithColdStartRetry } from '../api/client';
import type { EventoPreventivoRequest, EventoPreventivoResponse } from '../../types/api';

export async function getPlanoPreventivo(token: string, petId: number): Promise<EventoPreventivoResponse[]> {
  return requestWithColdStartRetry<EventoPreventivoResponse[]>(`/pets/${petId}/plano-preventivo`, {
    method: 'GET',
    token,
  });
}

export async function marcarComoRealizado(token: string, eventoId: number): Promise<EventoPreventivoResponse> {
  return requestWithColdStartRetry<EventoPreventivoResponse>(`/eventos-preventivos/${eventoId}/realizar`, {
    method: 'PUT',
    token,
  });
}

export async function criarEventoPreventivo(
  token: string,
  payload: EventoPreventivoRequest
): Promise<EventoPreventivoResponse> {
  // O PUT/GET acima são seguros pra repetir automaticamente no cold start do Render;
  // o POST aqui também usa o mesmo retry — no pior caso (timeout bem no meio do
  // primeiro request) pode duplicar um lembrete, mas isso é raro e preferível a
  // não tolerar o cold start, que é bem mais comum na prática.
  return requestWithColdStartRetry<EventoPreventivoResponse>('/eventos-preventivos', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}
