import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { getLeiturasColeira } from '../../services/leituras/leiturasService';
import { petKeys } from './queryKeys';

export function useLeiturasColeira(petId: number | null) {
  const { token } = useAuth();

  return useQuery({
    queryKey: petKeys.leiturasColeira(petId),
    queryFn: () => getLeiturasColeira(token as string, petId as number),
    enabled: Boolean(token) && petId != null,
  });
}
