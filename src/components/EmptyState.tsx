import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export function EmptyState({ title, description, icon = 'information-outline' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={32} color={colors.textSecondary} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing['2xl'] },
  title: { ...typography.cardTitle, color: colors.textPrimary, marginTop: spacing.md },
  description: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
});
