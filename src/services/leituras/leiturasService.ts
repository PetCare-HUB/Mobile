import { requestWithColdStartRetry } from '../api/client';
import type { LeituraAmbienteResponse, LeituraColeiraResponse, LeituraComedouroResponse } from '../../types/api';

export async function getLeiturasColeira(token: string, petId: number): Promise<LeituraColeiraResponse[]> {
  return requestWithColdStartRetry<LeituraColeiraResponse[]>(`/pets/${petId}/leituras/coleira`, { method: 'GET', token });
}

export async function getLeiturasComedouro(token: string, petId: number): Promise<LeituraComedouroResponse[]> {
  return requestWithColdStartRetry<LeituraComedouroResponse[]>(`/pets/${petId}/leituras/comedouro`, { method: 'GET', token });
}

export async function getLeiturasAmbiente(token: string, petId: number): Promise<LeituraAmbienteResponse[]> {
  return requestWithColdStartRetry<LeituraAmbienteResponse[]>(`/pets/${petId}/leituras/ambiente`, { method: 'GET', token });
}
