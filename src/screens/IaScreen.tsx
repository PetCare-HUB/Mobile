import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { StatusCard } from '../components/StatusCard';
import { colors, radius, spacing, typography } from '../theme';

export function IaScreen() {
  return (
    <ScreenContainer>
      <SectionHeader
        title="PetCare AI"
        subtitle="Sua assistente de bem-estar interpreta os sinais do Rex e te ajuda com orientações preventivas."
        level="page"
      />

      <StatusCard>
        <View style={styles.iconRow}>
          <View style={styles.iconBadge}>
            <MaterialCommunityIcons name="robot-outline" size={22} color={colors.aiPurple} />
          </View>
          <Text style={styles.message}>
            Olá! Em breve poderei analisar os dados do Rex e responder suas perguntas sobre
            atividade, alimentação, ambiente e cuidados preventivos.
          </Text>
        </View>
      </StatusCard>

      <View style={styles.inputMock}>
        <Text style={styles.inputPlaceholder}>Digite sua pergunta...</Text>
      </View>

      <Text style={styles.disclaimer}>A IA interpreta sinais. O veterinário diagnostica.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  iconRow: { flexDirection: 'row', alignItems: 'flex-start' },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: '#EFEDFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  message: { flex: 1, ...typography.body, color: colors.textPrimary },
  inputMock: {
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: radius.input,
    height: spacing.inputHeight,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
  },
  inputPlaceholder: { ...typography.body, color: colors.textSecondary },
  disclaimer: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md },
});
