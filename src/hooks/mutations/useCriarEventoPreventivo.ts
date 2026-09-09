import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { criarEventoPreventivo } from '../../services/preventive/preventiveService';
import { petKeys } from '../queries/queryKeys';
import type { EventoPreventivoRequest } from '../../types/api';

export function useCriarEventoPreventivo() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EventoPreventivoRequest) => criarEventoPreventivo(token as string, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: petKeys.preventivePlan(data.petId) });
    },
  });
}
