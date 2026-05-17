export type HealthStatus = 'healthy' | 'attention' | 'risk';

export type PetSummary = {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  score: number;
  status: HealthStatus;
  atividadeAtual: string;
};

export type SensorMetric = {
  id: number;
  title: string;
  value: string;
  description: string;
  status?: HealthStatus;
};

export type AlertItem = {
  id: number;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
};

export type PreventiveItemType = {
  id: number;
  title: string;
  date: string;
  description: string;
  done: boolean;
};