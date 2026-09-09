import type { HealthStatus } from '../types/pet';

export const colors = {
  background: '#F7FAF9',
  surface: '#FFFFFF',

  greenPrimary: '#087F68',
  greenSecondary: '#35B99A',
  greenLight: '#E8F7F2',

  bluePrimary: '#246B9C',
  blueLight: '#EAF4FB',

  textPrimary: '#153449',
  textSecondary: '#667985',

  borderGray: '#E5ECEF',
  backgroundGray: '#F2F5F6',

  success: '#23A66F',
  warning: '#F0A83B',
  danger: '#E45454',
  aiPurple: '#6D63D9',
} as const;

export const healthStatusColor: Record<HealthStatus, string> = {
  healthy: colors.success,
  attention: colors.warning,
  risk: colors.danger,
};
