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
  nome: string;
  email: string;
};

export type ClinicaResumoResponse = {
  id: number;
  nome: string;
};

export type StatusAcesso = 'PRE_CADASTRADO' | 'ATIVO' | 'BLOQUEADO' | 'INATIVO';

export type TutorResponse = {
  id: number;
  nome: string;
  statusAcesso: StatusAcesso;
  email: string;
  telefone: string;
  cpf: string;
  dataCadastro: string;
};

export type TutorRequest = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
};

export type PetRequest = {
  nome: string;
  especie: Especie;
  raca: string | null;
  dataNascimento: string | null;
  pesoKg: number | null;
  sexo: Sexo | null;
  condicoesCronicas: string | null;
  ativo: boolean;
  tutorId: number;
  clinicaId: number;
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

export type StatusAtividade = 'SEDENTARIO' | 'MODERADO' | 'ATIVO';

export type LeituraColeiraResponse = {
  id: number;
  petId: number;
  petNome: string;
  statusAtividade: StatusAtividade;
  nivelBateria: number;
  timestampLeitura: string;
};

export type LeituraComedouroResponse = {
  id: number;
  petId: number;
  petNome: string;
  nivelRacaoPct: number;
  pesoConsumidoG: number;
  timestampLeitura: string;
};

export type LeituraAmbienteResponse = {
  id: number;
  petId: number;
  petNome: string;
  temperaturaAmbiente: number;
  umidadePct: number;
  qualidadeArPpm: number;
  petPresente: boolean;
  timestampLeitura: string;
};
