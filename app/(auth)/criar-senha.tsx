import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { AppInput } from '../../src/components/AppInput';
import { Button } from '../../src/components/Button';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { SectionHeader } from '../../src/components/SectionHeader';
import { colors, spacing, typography } from '../../src/theme';
import { useAuth } from '../../src/contexts/auth/AuthContext';

export default function CriarSenhaScreen() {
  const { ativarConta } = useAuth();
  const { nome, cpf, email } = useLocalSearchParams<{ nome: string; cpf: string; email: string }>();
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [slowConnection, setSlowConnection] = useState(false);

  async function handleCriarConta() {
    if (senha.length < 8) {
      Alert.alert('Atenção', 'A senha precisa ter no mínimo 8 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setSlowConnection(false);
    try {
      await ativarConta(nome, cpf, email, senha, () => setSlowConnection(true));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível ativar a conta.';
      Alert.alert('Erro ao ativar conta', message);
    } finally {
      setLoading(false);
      setSlowConnection(false);
    }
  }

  return (
    <ScreenContainer>
      <SectionHeader
        title="Criar senha"
        subtitle="Defina a senha que você usará para entrar no app."
        level="page"
      />

      <AppInput label="Senha" placeholder="Mínimo 8 caracteres" value={senha} onChangeText={setSenha} secureTextEntry />
      <AppInput label="Confirmar senha" placeholder="Repita a senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />

      {slowConnection && (
        <Text style={styles.slowNotice}>
          Conectando ao servidor... isso pode levar até um minuto.
        </Text>
      )}

      <Button label="Ativar conta" onPress={handleCriarConta} loading={loading} style={styles.button} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  slowNotice: { ...typography.secondaryInfo, color: colors.textSecondary, marginBottom: spacing.md, textAlign: 'center' },
  button: { marginTop: spacing.md },
});
