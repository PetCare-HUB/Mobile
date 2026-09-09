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