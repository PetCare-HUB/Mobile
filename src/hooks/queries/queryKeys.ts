export const petKeys = {
  list: (tutorId: number | null) => ['pets', 'list', tutorId] as const,
  score: (petId: number | null) => ['pets', petId, 'score'] as const,
  alerts: (petId: number | null) => ['pets', petId, 'alerts'] as const,
  preventivePlan: (petId: number | null) => ['pets', petId, 'preventive-plan'] as const,
  leiturasColeira: (petId: number | null) => ['pets', petId, 'leituras-coleira'] as const,
  leiturasComedouro: (petId: number | null) => ['pets', petId, 'leituras-comedouro'] as const,
  leiturasAmbiente: (petId: number | null) => ['pets', petId, 'leituras-ambiente'] as const,
};
