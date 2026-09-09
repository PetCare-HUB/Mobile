import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  level?: 'page' | 'section';
};

export function SectionHeader({ title, subtitle, level = 'section' }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={level === 'page' ? styles.pageTitle : styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  pageTitle: { ...typography.pageTitle, color: colors.textPrimary },
  sectionTitle: { ...typography.cardTitle, color: colors.textPrimary, marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
