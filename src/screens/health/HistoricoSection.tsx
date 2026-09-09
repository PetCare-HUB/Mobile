import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export function HistoricoSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico em breve</Text>
      <Text style={styles.description}>
        O histórico longitudinal do pet vai reunir consultas, scores e leituras dos sensores
        ao longo do tempo assim que a integração com a API estiver completa.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.xl, alignItems: 'center' },
  title: { ...typography.cardTitle, color: colors.textPrimary, marginBottom: spacing.sm },
  description: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
