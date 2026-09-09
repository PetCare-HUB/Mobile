export type HealthStatus = 'healthy' | 'attention' | 'risk';

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
  timeAgo: string;
};

export type PreventiveTipo = 'VACINA' | 'CHECKUP' | 'VERMIFUGO' | 'RETORNO' | 'MEDICAMENTO';

export type PreventiveItemType = {
  id: number;
  title: string;
  tipo: PreventiveTipo;
  date: string;
  description: string;
  done: boolean;
  overdue?: boolean;
};