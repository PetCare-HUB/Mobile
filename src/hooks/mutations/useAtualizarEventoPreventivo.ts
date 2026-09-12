import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { atualizarEventoPreventivo } from '../../services/preventive/preventiveService';
import { petKeys } from '../queries/queryKeys';
import type { EventoPreventivoUpdateRequest } from '../../types/api';

export function useAtualizarEventoPreventivo(petId: number | null) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventoId, payload }: { eventoId: number; payload: EventoPreventivoUpdateRequest }) =>
      atualizarEventoPreventivo(token as string, eventoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.preventivePlan(petId) });
    },
  });
}
