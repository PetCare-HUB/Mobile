import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', disabled, loading, style }: ButtonProps) {
  const variantStyle = variantStyles[variant];

  return (
    <TouchableOpacity
      style={[styles.base, variantStyle.container, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text.color as string} />
      ) : (
        <Text style={[styles.label, variantStyle.text]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const variantStyles = {
  primary: {
    container: { backgroundColor: colors.greenPrimary, borderWidth: 0 },
    text: { color: colors.surface },
  },
  secondary: {
    container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderGray },
    text: { color: colors.textPrimary },
  },
  danger: {
    container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.danger },
    text: { color: colors.danger },
  },
} as const;

const styles = StyleSheet.create({
  base: {
    minHeight: spacing.minButtonHeight,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: { ...typography.subtitle },
  disabled: { opacity: 0.5 },
});
