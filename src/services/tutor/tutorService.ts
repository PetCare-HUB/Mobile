import { requestWithColdStartRetry } from '../api/client';
import type { TutorRequest, TutorResponse } from '../../types/api';

export async function getTutor(token: string, tutorId: number): Promise<TutorResponse> {
  return requestWithColdStartRetry<TutorResponse>(`/tutor/${tutorId}`, { method: 'GET', token });
}

export async function updateTutor(token: string, tutorId: number, payload: TutorRequest): Promise<TutorResponse> {
  return requestWithColdStartRetry<TutorResponse>(`/tutor/${tutorId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}
