import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { updateTutor } from '../../services/tutor/tutorService';
import { petKeys } from '../queries/queryKeys';
import type { TutorRequest } from '../../types/api';

export function useAtualizarTutor() {
  const { token, tutorId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TutorRequest) => updateTutor(token as string, tutorId as number, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.tutor(tutorId) });
    },
  });
}
