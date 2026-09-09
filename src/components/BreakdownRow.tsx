import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

type BreakdownRowProps = {
  color: string;
  label: string;
  valueLabel: string;
  percent: number;
};

export function BreakdownRow({ color, label, valueLabel, percent }: BreakdownRowProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(percent, 100)}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.value}>{valueLabel}</Text>
      <Text style={styles.percent}>{percent}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm + 2 },
  dot: { width: 8, height: 8, borderRadius: radius.pill, marginRight: spacing.sm },
  label: { ...typography.body, color: colors.textPrimary, width: 88 },
  track: { flex: 1, height: 6, borderRadius: radius.pill, backgroundColor: colors.backgroundGray, marginHorizontal: spacing.sm },
  fill: { height: 6, borderRadius: radius.pill },
  value: { ...typography.secondaryInfo, color: colors.textSecondary, width: 56, textAlign: 'right' },
  percent: { ...typography.secondaryInfo, color: colors.textSecondary, width: 34, textAlign: 'right' },
});
