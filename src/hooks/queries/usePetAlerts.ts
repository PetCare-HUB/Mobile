import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { getPetAlerts } from '../../services/pets/petsService';
import { petKeys } from './queryKeys';

export function usePetAlerts(petId: number | null) {
  const { token } = useAuth();

  return useQuery({
    queryKey: petKeys.alerts(petId),
    queryFn: () => getPetAlerts(token as string, petId as number),
    enabled: Boolean(token) && petId != null,
  });
}
