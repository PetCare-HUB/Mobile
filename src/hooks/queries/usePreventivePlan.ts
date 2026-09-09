import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { getPlanoPreventivo } from '../../services/preventive/preventiveService';
import { petKeys } from './queryKeys';

export function usePreventivePlan(petId: number | null) {
  const { token } = useAuth();

  return useQuery({
    queryKey: petKeys.preventivePlan(petId),
    queryFn: () => getPlanoPreventivo(token as string, petId as number),
    enabled: Boolean(token) && petId != null,
  });
}
