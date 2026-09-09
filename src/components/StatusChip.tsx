import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export type StatusChipTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

type StatusChipProps = {
  label: string;
  tone: StatusChipTone;
};

const toneStyles: Record<StatusChipTone, { bg: string; text: string }> = {
  success: { bg: colors.greenLight, text: colors.success },
  warning: { bg: '#FDF1DF', text: colors.warning },
  danger: { bg: '#FBE7E7', text: colors.danger },
  info: { bg: colors.blueLight, text: colors.bluePrimary },
  neutral: { bg: colors.backgroundGray, text: colors.textSecondary },
};

export function StatusChip({ label, tone }: StatusChipProps) {
  const { bg, text } = toneStyles[tone];
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  label: { ...typography.caption, fontWeight: '600' },
});
