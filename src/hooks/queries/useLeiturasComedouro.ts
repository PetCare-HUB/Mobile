import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { getLeiturasComedouro } from '../../services/leituras/leiturasService';
import { petKeys } from './queryKeys';

export function useLeiturasComedouro(petId: number | null) {
  const { token } = useAuth();

  return useQuery({
    queryKey: petKeys.leiturasComedouro(petId),
    queryFn: () => getLeiturasComedouro(token as string, petId as number),
    enabled: Boolean(token) && petId != null,
  });
}
