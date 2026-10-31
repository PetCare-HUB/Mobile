import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/auth/AuthContext';
import { perguntarIa } from '../../services/ia/iaService';

type Variaveis = {
  petId: number;
  pergunta: string;
};

/**
 * Mutation, e nao query, porque a pergunta e uma acao do usuario: nao deve
 * refazer sozinha ao focar a tela nem ficar em cache com a resposta antiga.
 */
export function usePerguntarIa() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: ({ petId, pergunta }: Variaveis) => perguntarIa(token as string, petId, pergunta),
  });
}
