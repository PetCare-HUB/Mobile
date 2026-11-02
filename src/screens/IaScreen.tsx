import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { StatusCard } from '../components/StatusCard';
import { usePerguntarIa } from '../hooks/mutations/usePerguntarIa';
import { LIMITE_PERGUNTA } from '../services/ia/iaService';
import { colors, radius, spacing, typography } from '../theme';
import { usePetContext } from '../contexts/pet/PetContext';

/**
 * O backend devolve o nome do arquivo da base ("02-alertas-do-sistema.md").
 * Para o tutor isso e ruido; o numero so existe para ordenar os documentos.
 */
function rotularFonte(fonte: string): string {
  const limpo = fonte
    .replace(/\.md$/i, '')
    .replace(/^\d+[-_]/, '')
    .replace(/[-_]/g, ' ')
    .trim();

  if (limpo.length === 0) return fonte;
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

export function IaScreen() {
  const { selectedPet } = usePetContext();
  const petName = selectedPet?.nome ?? 'seu pet';

  // O campo e nao controlado de proposito. Com value={pergunta} o React
  // reescreve o texto nativo a cada tecla, e no Android isso atropela a regiao
  // de composicao do teclado: acento nao fecha e o backspace chega a apagar a
  // frase inteira. Aqui o texto vive no ref, o React nunca o sobrescreve, e o
  // state guarda so o tamanho, que e o que o contador precisa.
  const pergunta = useRef('');
  const [tamanho, setTamanho] = useState(0);
  const perguntar = usePerguntarIa();

  // Sem pet selecionado nao ha o que perguntar: o endpoint e por pet.
  const podeEnviar = selectedPet != null && tamanho > 0 && !perguntar.isPending;

  function enviar() {
    const texto = pergunta.current.trim();
    if (!podeEnviar || selectedPet == null || texto.length === 0) return;
    perguntar.mutate({ petId: selectedPet.id, pergunta: texto });
  }

  return (
    <ScreenContainer>
      <SectionHeader
        title="PetCare AI"
        subtitle={`Sua assistente de bem-estar interpreta os sinais do ${petName} e te ajuda com orientações preventivas.`}
        level="page"
      />

      {selectedPet == null ? (
        <StatusCard>
          <View style={styles.iconRow}>
            <View style={styles.iconBadge}>
              <MaterialCommunityIcons name="paw-off" size={22} color={colors.textSecondary} />
            </View>
            <Text style={styles.message}>
              Escolha um pet para perguntar. A assistente responde a partir dos dados daquele
              pet, então ela precisa saber de quem você está falando.
            </Text>
          </View>
        </StatusCard>
      ) : null}

      <View style={styles.campo}>
        <TextInput
          style={styles.input}
          defaultValue=""
          onChangeText={(texto) => {
            pergunta.current = texto;
            setTamanho(texto.length);
          }}
          placeholder={`O que você quer saber sobre o ${petName}?`}
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={LIMITE_PERGUNTA}
          editable={selectedPet != null}
          autoCapitalize="sentences"
        />
        <Text style={styles.contador}>
          {tamanho}/{LIMITE_PERGUNTA}
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
                <Text key={fonte} style={styles.fonteTexto}>
                  {rotularFonte(fonte)}
                </Text>
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
  fonteTexto: { ...typography.caption, color: colors.textPrimary, marginBottom: spacing.xs },
  disclaimer: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
