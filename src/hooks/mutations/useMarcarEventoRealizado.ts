import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { marcarComoRealizado } from '../../services/preventive/preventiveService';
import { petKeys } from '../queries/queryKeys';

export function useMarcarEventoRealizado() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventoId: number) => marcarComoRealizado(token as string, eventoId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: petKeys.preventivePlan(data.petId) });
      queryClient.invalidateQueries({ queryKey: petKeys.score(data.petId) });
    },
  });
}
