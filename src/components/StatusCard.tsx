import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';

type StatusCardProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function StatusCard({ children, style }: StatusCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.cardMd,
    borderWidth: 1,
    borderColor: colors.borderGray,
    padding: spacing.cardPadding,
    marginBottom: spacing.cardGap,
  },
});
