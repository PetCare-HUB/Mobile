/**
 * Contrato do endpoint da PetCare AI, consumido pelo app do tutor.
 *
 * A implementacao do backend ainda nao existe -- esta documentada em
 * docs/contrato-ia.md para quem for construi-la. O app ja chama este formato,
 * entao ligar a tela e questao de definir EXPO_PUBLIC_IA_API_URL.
 */

export type PerguntaIaRequest = {
  pergunta: string;
};

/**
 * De onde a resposta saiu. Existe porque o enunciado da disciplina proibe
 * diagnostico: mostrar o dado que embasou a resposta e o que separa
 * "orientacao sobre os dados do pet" de "parecer veterinario".
 */
export type FonteIa = {
  rotulo: string;
  detalhe: string;
};

export type RespostaIaResponse = {
  resposta: string;
  /** ISO 8601, como o resto da API. */
  geradoEm: string;
  fontes: FonteIa[];
};
