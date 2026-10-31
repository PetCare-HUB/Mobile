import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { StatusCard } from '../components/StatusCard';
import { usePerguntarIa } from '../hooks/mutations/usePerguntarIa';
import { iaDisponivel } from '../services/ia/iaService';
import { colors, radius, spacing, typography } from '../theme';
import { usePetContext } from '../contexts/pet/PetContext';

const LIMITE_PERGUNTA = 280;

export function IaScreen() {
  const { selectedPet } = usePetContext();
  const petName = selectedPet?.nome ?? 'seu pet';

  const [pergunta, setPergunta] = useState('');
  const perguntar = usePerguntarIa();

  // Sem pet selecionado nao ha o que perguntar: o endpoint e por pet.
  const podeEnviar =
    iaDisponivel && selectedPet != null && pergunta.trim().length > 0 && !perguntar.isPending;

  function enviar() {
    if (!podeEnviar || selectedPet == null) return;
    perguntar.mutate({ petId: selectedPet.id, pergunta: pergunta.trim() });
  }

  return (
    <ScreenContainer>
      <SectionHeader
        title="PetCare AI"
        subtitle={`Sua assistente de bem-estar interpreta os sinais do ${petName} e te ajuda com orientações preventivas.`}
        level="page"
      />

      {!iaDisponivel ? (
        <StatusCard>
          <View style={styles.iconRow}>
            <View style={styles.iconBadge}>
              <MaterialCommunityIcons name="robot-off-outline" size={22} color={colors.textSecondary} />
            </View>
            <Text style={styles.message}>
              A assistente ainda não está conectada neste build. Assim que o serviço de IA
              estiver publicado, esta tela passa a responder sem precisar de atualização do
              app.
            </Text>
          </View>
        </StatusCard>
      ) : null}

      <View style={styles.campo}>
        <TextInput
          style={styles.input}
          value={pergunta}
          onChangeText={setPergunta}
          placeholder={`O que você quer saber sobre o ${petName}?`}
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={LIMITE_PERGUNTA}
          editable={iaDisponivel && selectedPet != null}
          onSubmitEditing={enviar}
        />
        <Text style={styles.contador}>
          {pergunta.length}/{LIMITE_PERGUNTA}
        </Text>
      </View>

      <Button
        label="Perguntar"
        onPress={enviar}
        disabled={!podeEnviar}
        loading={perguntar.isPending}
      />

      {perguntar.isPending ? (
        <View style={styles.carregando}>
          <ActivityIndicator color={colors.aiPurple} />
          <Text style={styles.carregandoTexto}>Analisando os dados do {petName}...</Text>
        </View>
      ) : null}

      {perguntar.isError ? (
        <StatusCard>
          <View style={styles.iconRow}>
            <View style={[styles.iconBadge, styles.iconBadgeErro]}>
              <MaterialCommunityIcons name="alert-outline" size={22} color={colors.danger} />
            </View>
            <Text style={styles.message}>
              {perguntar.error instanceof Error
                ? perguntar.error.message
                : 'Não foi possível consultar a assistente agora.'}
            </Text>
          </View>
        </StatusCard>
      ) : null}

      {perguntar.data ? (
        <StatusCard>
          <View style={styles.iconRow}>
            <View style={styles.iconBadge}>
              <MaterialCommunityIcons name="robot-outline" size={22} color={colors.aiPurple} />
            </View>
            <Text style={styles.message}>{perguntar.data.resposta}</Text>
          </View>

          {perguntar.data.fontes.length > 0 ? (
            <View style={styles.fontes}>
              <Text style={styles.fontesTitulo}>No que a resposta se baseia</Text>
              {perguntar.data.fontes.map((fonte) => (
                <View key={`${fonte.rotulo}-${fonte.detalhe}`} style={styles.fonteLinha}>
                  <Text style={styles.fonteRotulo}>{fonte.rotulo}</Text>
                  <Text style={styles.fonteDetalhe}>{fonte.detalhe}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </StatusCard>
      ) : null}

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
  iconBadgeErro: { backgroundColor: '#FDECEC' },
  message: { flex: 1, ...typography.body, color: colors.textPrimary },
  campo: {
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    minHeight: spacing.inputHeight,
    textAlignVertical: 'top',
    paddingVertical: 0,
  },
  contador: { ...typography.caption, color: colors.textSecondary, textAlign: 'right' },
  carregando: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  carregandoTexto: { ...typography.caption, color: colors.textSecondary },
  fontes: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
  },
  fontesTitulo: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  fonteLinha: { flexDirection: 'row', marginBottom: spacing.xs },
  fonteRotulo: { ...typography.caption, color: colors.textPrimary, marginRight: spacing.sm },
  fonteDetalhe: { flex: 1, ...typography.caption, color: colors.textSecondary },
  disclaimer: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
