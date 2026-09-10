import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { updatePet } from '../../services/pets/petsService';
import { petKeys } from '../queries/queryKeys';
import type { PetRequest } from '../../types/api';

export function useAtualizarPet() {
  const { token, tutorId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, payload }: { petId: number; payload: PetRequest }) =>
      updatePet(token as string, petId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.list(tutorId) });
    },
  });
}
