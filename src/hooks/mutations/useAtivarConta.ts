import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';

type AtivarContaVariables = {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  onSlowConnection?: () => void;
};

export function useAtivarConta() {
  const { ativarConta } = useAuth();

  return useMutation({
    mutationFn: ({ nome, cpf, email, senha, onSlowConnection }: AtivarContaVariables) =>
      ativarConta(nome, cpf, email, senha, onSlowConnection),
    retry: false,
  });
}
