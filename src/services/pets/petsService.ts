import { requestWithColdStartRetry } from '../api/client';
import type { AlertaSaudeResponse, PetResponse, ScoreSaudeResponse } from '../../types/api';

function extractPetsArray(raw: unknown): PetResponse[] {
  if (Array.isArray(raw)) return raw as PetResponse[];
  if (raw && typeof raw === 'object' && Array.isArray((raw as { content?: unknown }).content)) {
    return (raw as { content: PetResponse[] }).content;
  }
  return [];
}

export async function getPets(token: string, tutorId: number | null): Promise<PetResponse[]> {
  const raw = await requestWithColdStartRetry<unknown>('/pets', { method: 'GET', token });
  const pets = extractPetsArray(raw);

  if (tutorId == null) return pets;

  const scoped = pets.filter((pet) => pet.tutor?.id === tutorId);
  return scoped.length > 0 || pets.length === 0 ? scoped : pets;
}

export async function getPetScore(token: string, petId: number): Promise<ScoreSaudeResponse> {
  return requestWithColdStartRetry<ScoreSaudeResponse>(`/pets/${petId}/score-saude`, { method: 'GET', token });
}

export async function getPetAlerts(token: string, petId: number): Promise<AlertaSaudeResponse[]> {
  return requestWithColdStartRetry<AlertaSaudeResponse[]>(`/pets/${petId}/alertas/ativos`, { method: 'GET', token });
}
