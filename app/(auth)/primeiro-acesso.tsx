import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { AppInput } from '../../src/components/AppInput';
import { Button } from '../../src/components/Button';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { SectionHeader } from '../../src/components/SectionHeader';
import { spacing } from '../../src/theme';

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
      <SectionHeader
        title="Primeiro acesso"
        subtitle="Utilize os dados fornecidos pela sua clínica para localizar seu pré-cadastro."
        level="page"
      />

      <AppInput label="Nome completo" placeholder="Seu nome" value={nome} onChangeText={setNome} />
      <AppInput label="CPF" placeholder="000.000.000-00" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
      <AppInput label="E-mail" placeholder="seu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Button label="Continuar" onPress={handleContinuar} style={styles.button} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  button: { marginTop: spacing.md },
});
