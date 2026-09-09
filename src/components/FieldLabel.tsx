import { StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../theme';

type FieldLabelProps = {
  text: string;
  required?: boolean;
};

export function FieldLabel({ text, required }: FieldLabelProps) {
  return (
    <Text style={styles.label}>
      {text}
      {required === true ? <Text style={styles.required}> *</Text> : null}
      {required === false ? <Text style={styles.optional}> (opcional)</Text> : null}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.secondaryInfo, color: colors.textSecondary, marginBottom: spacing.xs },
  required: { color: colors.danger },
  optional: { color: colors.textSecondary, fontStyle: 'italic' },
});
