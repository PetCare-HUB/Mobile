import { apiRequest, requestWithColdStartRetry } from '../api/client';
import type { AlertaSaudeResponse, PetRequest, PetResponse, ScoreSaudeResponse } from '../../types/api';

function extractPetsArray(raw: unknown): PetResponse[] {
  if (Array.isArray(raw)) return raw as PetResponse[];
  if (raw && typeof raw === 'object' && Array.isArray((raw as { content?: unknown }).content)) {
    return (raw as { content: PetResponse[] }).content;
  }
  return [];
}

// TODO: hoje GET /pets no backend devolve os pets de TODOS os tutores, paginado
// (10 por página por padrão), sem filtro por usuário autenticado. Enquanto isso
// não muda no Java:
// - pedimos uma página grande (`size`) pra não perder pet de página 2+;
// - filtramos por tutor no cliente, e NUNCA caímos de volta pra lista sem
//   filtro (mesmo que o filtro dê vazio) — isso vazaria pet de outro tutor.
// Quando o backend passar a filtrar por tutor autenticado, isso simplifica.
const PETS_PAGE_SIZE = 1000;

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
