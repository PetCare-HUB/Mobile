import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppInput } from '../../src/components/AppInput';
import { Button } from '../../src/components/Button';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { SectionHeader } from '../../src/components/SectionHeader';
import { StatusCard } from '../../src/components/StatusCard';
import { StepIndicator } from '../../src/components/StepIndicator';
import { colors, radius, spacing, typography } from '../../src/theme';
import { formatCpf } from '../../src/utils/formatters';

export default function PrimeiroAcessoScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');

  function handleContinuar() {
    if (!nome || !cpf || !email) {
      Alert.alert('Atenção', 'Preencha nome, CPF e e-mail.');
      return;
    }
    router.push({
      pathname: '/(auth)/validar-cadastro',
      params: { nome, cpf, email },
    });
  }

  return (
    <ScreenContainer>
      <StepIndicator step={1} total={3} />

      <View style={styles.iconBadge}>
        <MaterialCommunityIcons name="paw" size={22} color={colors.greenPrimary} />
      </View>

      <SectionHeader
        title="Primeiro acesso"
        subtitle="Utilize os dados fornecidos pela sua clínica para localizar seu pré-cadastro."
        level="page"
      />

      <StatusCard>
        <AppInput label="Nome completo" placeholder="Seu nome" value={nome} onChangeText={setNome} icon="account-outline" />
        <AppInput
          label="CPF"
          placeholder="000.000.000-00"
          value={cpf}
          onChangeText={(text) => setCpf(formatCpf(text))}
          keyboardType="numeric"
          icon="card-account-details-outline"
        />
        <AppInput label="E-mail" placeholder="seu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" icon="email-outline" />
      </StatusCard>

      <Button label="Continuar" onPress={handleContinuar} style={styles.button} />

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backLink}>Já tem conta? Voltar para o login</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  button: { marginTop: spacing.md, marginBottom: spacing.lg },
  backLink: { ...typography.body, color: colors.bluePrimary, textAlign: 'center' },
});
