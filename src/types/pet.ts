export type HealthStatus = 'healthy' | 'attention' | 'risk';

export type AlertItem = {
  id: number;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timeAgo: string;
};