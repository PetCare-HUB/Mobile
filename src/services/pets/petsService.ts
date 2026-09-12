import { apiRequest, requestWithColdStartRetry } from '../api/client';
import type { AlertaSaudeResponse, PetRequest, PetResponse, ScoreSaudeResponse } from '../../types/api';

function extractPetsArray(raw: unknown): PetResponse[] {
  if (Array.isArray(raw)) return raw as PetResponse[];
  if (raw && typeof raw === 'object' && Array.isArray((raw as { content?: unknown }).content)) {
    return (raw as { content: PetResponse[] }).content;
  }
  return [];
}

// O Java (a partir do commit 89742c6) já filtra GET /pets pelo tutor
// autenticado direto no servidor. MAS: enquanto não confirmarmos que o
// deploy em produção já está rodando essa versão, mantemos o filtro no
// cliente como segunda camada de defesa — nunca custa caro e evita
// vazar pet de outro tutor caso o servidor em produção ainda esteja
// numa versão antiga (deploy atrasado/falho). NUNCA cai de volta pra
// lista sem filtro, mesmo que o filtro dê vazio.
const PETS_PAGE_SIZE = 100;

export async function getPets(token: string, tutorId: number | null): Promise<PetResponse[]> {
  const raw = await requestWithColdStartRetry<unknown>(`/pets?size=${PETS_PAGE_SIZE}`, { method: 'GET', token });
  const pets = extractPetsArray(raw);

  if (tutorId == null) return [];

  return pets.filter((pet) => pet.tutor?.id === tutorId);
}

export async function getPetScore(token: string, petId: number): Promise<ScoreSaudeResponse> {
  return requestWithColdStartRetry<ScoreSaudeResponse>(`/pets/${petId}/score-saude`, { method: 'GET', token });
}

export async function getPetAlerts(token: string, petId: number): Promise<AlertaSaudeResponse[]> {
  return requestWithColdStartRetry<AlertaSaudeResponse[]>(`/pets/${petId}/alertas/ativos`, { method: 'GET', token });
}

export async function createPet(token: string, payload: PetRequest): Promise<PetResponse> {
  // POST não é idempotente: repetir automaticamente depois de um timeout pode
  // criar o pet duas vezes se a primeira chamada já tiver sido processada no
  // servidor. Por isso, ao contrário das leituras (GET), aqui só damos UMA
  // chamada com timeout maior (cobre o cold start do Render) em vez de retry.
  return apiRequest<PetResponse>('/pets', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
    timeoutMs: 45_000,
  });
}

export async function updatePet(token: string, petId: number, payload: PetRequest): Promise<PetResponse> {
  return requestWithColdStartRetry<PetResponse>(`/pets/${petId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function deletePet(token: string, petId: number): Promise<void> {
  await requestWithColdStartRetry<void>(`/pets/${petId}`, { method: 'DELETE', token });
}
