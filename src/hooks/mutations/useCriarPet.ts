import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { createPet } from '../../services/pets/petsService';
import { petKeys } from '../queries/queryKeys';
import type { PetRequest } from '../../types/api';

export function useCriarPet() {
  const { token, tutorId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<PetRequest, 'tutorId'>) =>
      createPet(token as string, { ...payload, tutorId: tutorId as number }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.list(tutorId) });
    },
  });
}
