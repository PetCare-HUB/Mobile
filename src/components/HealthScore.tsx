import { StyleSheet, Text, View } from 'react-native';
import type { HealthStatus } from '../types/pet';
import { colors, healthScoreBand, healthScoreBandColor, radius, shadows, spacing, typography } from '../theme';
import { HealthScoreRing } from './HealthScoreRing';

type HealthScoreProps = {
  petName: string;
  score: number;
  status: HealthStatus;
};

function getStatusLabel(status: HealthStatus) {
  if (status === 'healthy') return 'Excelente!';
  if (status === 'attention') return 'Atenção';
  return 'Risco';
}

const statusDescription: Record<HealthStatus, string> = {
  healthy: 'está com bons indicadores de saúde.',
  attention: 'apresenta sinais fora do padrão recente.',
  risk: 'precisa de atenção — procure a clínica responsável.',
};

export function HealthScore({ petName, score, status }: HealthScoreProps) {
  const color = healthScoreBandColor[healthScoreBand(score)];

  return (
    <View style={styles.card}>
      <HealthScoreRing score={score} />
      <View style={styles.info}>
        <Text style={[styles.status, { color }]}>{getStatusLabel(status)}</Text>
        <Text style={styles.description}>
          {petName} {statusDescription[status]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.cardLg,
    padding: spacing.cardPadding + 4,
    marginBottom: spacing.cardGap,
    ...shadows.subtleCard,
  },
  info: { flex: 1, marginLeft: spacing.lg },
  status: { ...typography.cardTitle, marginBottom: spacing.xs },
  description: { ...typography.body, color: colors.textSecondary },
});
