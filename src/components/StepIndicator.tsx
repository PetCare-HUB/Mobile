import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

type StepIndicatorProps = {
  step: number;
  total: number;
};

export function StepIndicator({ step, total }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {Array.from({ length: total }).map((_, index) => (
          <View
            key={index}
            style={[styles.bar, index < step ? styles.barActive : styles.barInactive]}
          />
        ))}
      </View>
      <Text style={styles.label}>Passo {step} de {total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  bars: { flexDirection: 'row', gap: spacing.xs },
  bar: { flex: 1, height: 4, borderRadius: radius.pill },
  barActive: { backgroundColor: colors.greenPrimary },
  barInactive: { backgroundColor: colors.borderGray },
  label: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
});
