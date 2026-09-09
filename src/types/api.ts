export type Especie = 'CAO' | 'GATO' | 'OUTRO';
export type Sexo = 'M' | 'F';
export type ScoreCategoria = 'VERDE' | 'AMARELO' | 'VERMELHO';
export type AlertaNivel = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';
export type AlertaTipo =
  | 'BATERIA_COLEIRA_BAIXA'
  | 'RACAO_BAIXA'
  | 'BAIXA_ALIMENTACAO'
  | 'AMBIENTE_RUIM'
  | 'TEMPERATURA_FORA_DA_FAIXA'
  | 'UMIDADE_FORA_DA_FAIXA'
  | 'SCORE_CRITICO'
  | 'CONSULTA_ATRASADA'
  | 'SCORE_BAIXO'
  | 'ATIVIDADE_BAIXA';

export type TutorResumoResponse = {
  id: number;
  [key: string]: unknown;
};

export type ClinicaResumoResponse = {
  id: number;
  [key: string]: unknown;
};

export type PetResponse = {
  id: number;
  nome: string;
  especie: Especie;
  raca: string;
  dataNascimento: string;
  pesoKg: number;
  sexo: Sexo;
  condicoesCronicas: string;
  ativo: boolean;
  dataCadastro: string;
  tutor: TutorResumoResponse;
  clinica: ClinicaResumoResponse;
};

export type ScoreSaudeResponse = {
  id: number;
  petId: number;
  petNome: string;
  scoreTotal: number;
  scoreAtividade: number;
  scoreAlimentacao: number;
  scoreAmbiente: number;
  scoreConsulta: number;
  scorePreventivo: number;
  categoria: ScoreCategoria;
  dataCalculo: string;
};

export type AlertaSaudeResponse = {
  id: number;
  petId: number;
  petNome: string;
  tipo: AlertaTipo;
  nivel: AlertaNivel;
  mensagem: string;
  valorDetectado: number;
  limiteReferencia: number;
  resolvido: boolean;
  dataAlerta: string;
  dataResolucao: string | null;
};

export type TipoEventoPreventivo = 'VACINA' | 'CHECKUP' | 'VERMIFUGO' | 'RETORNO' | 'MEDICAMENTO';
export type StatusEventoPreventivo = 'PENDENTE' | 'REALIZADO';

export type EventoPreventivoResponse = {
  id: number;
  petId: number;
  petNome: string;
  tipo: TipoEventoPreventivo;
  descricao: string;
  dataPrevista: string;
  status: StatusEventoPreventivo;
  dataRealizacao: string | null;
};

export type EventoPreventivoRequest = {
  petId: number;
  tipo: TipoEventoPreventivo;
  descricao: string;
  dataPrevista: string;
};
