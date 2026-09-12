import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';

type LoginVariables = {
  email: string;
  password: string;
  onSlowConnection?: () => void;
};

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: ({ email, password, onSlowConnection }: LoginVariables) =>
      login(email, password, onSlowConnection),
    retry: false,
  });
}
