import { apiRequest, requestWithColdStartRetry } from '../api/client';
import type { EventoPreventivoRequest, EventoPreventivoResponse, EventoPreventivoUpdateRequest } from '../../types/api';

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
  // O PUT/GET acima são seguros pra repetir automaticamente no cold start do Render
  // (idempotentes). POST não é — por isso aqui usamos uma única chamada com timeout
  // maior (cobre o cold start) em vez do retry automático, pra não duplicar o lembrete.
  return apiRequest<EventoPreventivoResponse>('/eventos-preventivos', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
    timeoutMs: 45_000,
  });
}

export async function atualizarEventoPreventivo(
  token: string,
  eventoId: number,
  payload: EventoPreventivoUpdateRequest
): Promise<EventoPreventivoResponse> {
  return requestWithColdStartRetry<EventoPreventivoResponse>(`/eventos-preventivos/${eventoId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function excluirEventoPreventivo(token: string, eventoId: number): Promise<void> {
  await requestWithColdStartRetry<void>(`/eventos-preventivos/${eventoId}`, { method: 'DELETE', token });
}
