import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { StatusChip } from './StatusChip';
import { Button } from './Button';

type PreventiveItemProps = {
  title: string;
  date: string;
  description: string;
  done: boolean;
  onToggle?: () => void;
};

export function PreventiveItem({ title, date, description, done, onToggle }: PreventiveItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <StatusChip label={done ? 'Feito' : 'Pendente'} tone={done ? 'success' : 'warning'} />
      </View>

      <Text style={styles.date}>{date}</Text>
      <Text style={styles.description}>{description}</Text>

      {onToggle && (
        <Button
          label={done ? 'Marcar como pendente' : 'Marcar como feito'}
          onPress={onToggle}
          variant={done ? 'secondary' : 'primary'}
          style={styles.button}
        />
      )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.xs + 2,
  },
  title: { flex: 1, ...typography.cardTitle, color: colors.textPrimary },
  date: { ...typography.body, color: colors.bluePrimary, fontWeight: '600', marginBottom: spacing.xs + 2 },
  description: { ...typography.body, color: colors.textSecondary },
  button: { marginTop: spacing.md + 2 },
});
