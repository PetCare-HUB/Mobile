export const petKeys = {
  list: (tutorId: number | null) => ['pets', 'list', tutorId] as const,
  score: (petId: number | null) => ['pets', petId, 'score'] as const,
  alerts: (petId: number | null) => ['pets', petId, 'alerts'] as const,
};
