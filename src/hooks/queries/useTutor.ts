import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { getTutor } from '../../services/tutor/tutorService';
import { petKeys } from './queryKeys';

export function useTutor() {
  const { token, tutorId } = useAuth();

  return useQuery({
    queryKey: petKeys.tutor(tutorId),
    queryFn: () => getTutor(token as string, tutorId as number),
    enabled: Boolean(token) && tutorId != null,
  });
}
