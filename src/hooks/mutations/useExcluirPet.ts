import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { deletePet } from '../../services/pets/petsService';
import { petKeys } from '../queries/queryKeys';

export function useExcluirPet() {
  const { token, tutorId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (petId: number) => deletePet(token as string, petId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.list(tutorId) });
    },
  });
}
