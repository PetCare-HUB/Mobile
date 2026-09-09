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

export type HealthScoreBand = 'good' | 'warn' | 'bad';

export function healthScoreBand(score: number): HealthScoreBand {
  if (score >= 80) return 'good';
  if (score >= 50) return 'warn';
  return 'bad';
}

export const healthScoreBandColor: Record<HealthScoreBand, string> = {
  good: colors.success,
  warn: colors.warning,
  bad: colors.danger,
};
