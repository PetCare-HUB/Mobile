import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { getPets } from '../../services/pets/petsService';
import { petKeys } from './queryKeys';

export function usePets() {
  const { token, tutorId } = useAuth();

  return useQuery({
    queryKey: petKeys.list(tutorId),
    queryFn: () => getPets(token as string, tutorId),
    enabled: Boolean(token),
  });
}
