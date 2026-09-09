import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { getPetScore } from '../../services/pets/petsService';
import { petKeys } from './queryKeys';

export function usePetScore(petId: number | null) {
  const { token } = useAuth();

  return useQuery({
    queryKey: petKeys.score(petId),
    queryFn: () => getPetScore(token as string, petId as number),
    enabled: Boolean(token) && petId != null,
  });
}
