import { StyleSheet, Text, View } from 'react-native';

import type { HealthStatus } from '../types/pet';
import { colors, radius, spacing, typography } from '../theme';

type SensorCardProps = {
  title: string;
  value: string;
  description: string;
  status?: HealthStatus;
};

function getStatusColor(status?: HealthStatus) {
  if (status === 'healthy') return colors.success;
  if (status === 'attention') return colors.warning;
  if (status === 'risk') return colors.danger;
  return colors.bluePrimary;
}

export function SensorCard({ title, value, description, status }: SensorCardProps) {
  const color = getStatusColor(status);

  return (
    <View style={styles.card}>
      <View style={[styles.indicator, { backgroundColor: color }]} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.cardMd,
    borderWidth: 1,
    borderColor: colors.borderGray,
    padding: spacing.cardPadding,
    marginBottom: spacing.cardGap,
    flexDirection: 'row',
  },
  indicator: {
    width: 6,
    borderRadius: radius.pill,
    marginRight: spacing.md + 2,
  },
  content: { flex: 1 },
  title: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xs },
  value: { ...typography.pageTitle, fontSize: 22, marginBottom: spacing.xs + 2 },
  description: { ...typography.body, color: colors.textSecondary },
});
