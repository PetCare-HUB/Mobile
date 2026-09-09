import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { getLeiturasAmbiente } from '../../services/leituras/leiturasService';
import { petKeys } from './queryKeys';

export function useLeiturasAmbiente(petId: number | null) {
  const { token } = useAuth();

  return useQuery({
    queryKey: petKeys.leiturasAmbiente(petId),
    queryFn: () => getLeiturasAmbiente(token as string, petId as number),
    enabled: Boolean(token) && petId != null,
  });
}
