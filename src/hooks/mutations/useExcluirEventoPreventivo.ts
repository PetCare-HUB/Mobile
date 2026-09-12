import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { excluirEventoPreventivo } from '../../services/preventive/preventiveService';
import { petKeys } from '../queries/queryKeys';

export function useExcluirEventoPreventivo(petId: number | null) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventoId: number) => excluirEventoPreventivo(token as string, eventoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.preventivePlan(petId) });
    },
  });
}
