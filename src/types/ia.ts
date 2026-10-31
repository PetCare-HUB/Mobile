/**
 * Contrato do endpoint da PetCare AI, consumido pelo app do tutor.
 *
 * A IA vive na propria API Java (POST /pets/{petId}/ia/perguntar), entao os
 * campos abaixo espelham o AnaliseIaResponse de lá -- inclusive os que o app
 * ainda nao mostra, para que a resposta nao precise ser remapeada quando
 * alguma tela passar a usa-los.
 */

export type PerguntaIaRequest = {
  pergunta: string;
};

/** O que motivou a chamada. O app só produz PERGUNTA. */
export type TipoAnaliseIa = 'ANALISE_SAUDE' | 'PERGUNTA' | 'EXPLICACAO_ALERTA';

export type AnaliseIaResponse = {
  id: number;
  petId: number;
  petNome: string;
  tipo: TipoAnaliseIa;
  /** Nulo quando a analise nao partiu de uma pergunta. */
  pergunta: string | null;
  resposta: string;
  scoreId: number | null;
  alertaId: number | null;
  modelo: string;
  /**
   * Trechos da base veterinaria que embasaram a resposta. Vem como texto
   * pronto, nao como par rotulo/detalhe. Existe porque o enunciado da
   * disciplina proibe diagnostico: mostrar o que embasou a resposta e o que
   * separa "orientacao sobre os dados do pet" de "parecer veterinario".
   */
  fontes: string[];
  /** LocalDateTime do backend: ISO 8601 sem fuso. */
  dataAnalise: string;
};
