import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { HealthStatus } from '../types/pet';
import { colors, healthScoreBand, healthScoreBandColor, radius, shadows, spacing, typography } from '../theme';
import { HealthScoreRing } from './HealthScoreRing';

type HealthScoreProps = {
  petName: string;
  score: number;
  status: HealthStatus;
  onPress?: () => void;
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

export function HealthScore({ petName, score, status, onPress }: HealthScoreProps) {
  const color = healthScoreBandColor[healthScoreBand(score)];
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container style={styles.card} onPress={onPress} activeOpacity={onPress ? 0.8 : undefined}>
      <HealthScoreRing score={score} />
      <View style={styles.info}>
        <Text style={[styles.status, { color }]}>{getStatusLabel(status)}</Text>
        <Text style={styles.description}>
          {petName} {statusDescription[status]}
        </Text>
      </View>
      {onPress ? (
        <View style={styles.chevron}>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </View>
      ) : null}
    </Container>
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
  chevron: { marginLeft: spacing.xs },
  status: { ...typography.cardTitle, marginBottom: spacing.xs },
  description: { ...typography.body, color: colors.textSecondary },
});
