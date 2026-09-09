import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppInput } from '../components/AppInput';
import { Button } from '../components/Button';
import { SectionHeader } from '../components/SectionHeader';
import { StatusCard } from '../components/StatusCard';
import { colors, radius, spacing, typography } from '../theme';
import { useAuth } from '../contexts/auth/AuthContext';
import { getPetProfile, removePetProfile, savePetProfile } from '../storage/petStorage';
import { getPreferences, savePreferences } from '../storage/preferencesStorage';

export function PetProfileScreen() {
  const { logout } = useAuth();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [clinica, setClinica] = useState('');
  const [perfilCarregado, setPerfilCarregado] = useState(false);
  const [notifAlertas, setNotifAlertas] = useState(true);
  const [notifPreventivo, setNotifPreventivo] = useState(true);
  const [notifRacao, setNotifRacao] = useState(true);

  useEffect(() => {
    async function carregarPerfilSalvo() {
      const perfilSalvo = await getPetProfile();
      const prefs = await getPreferences();

      if (perfilSalvo) {
        setNome(perfilSalvo.nome);
        setEspecie(perfilSalvo.especie);
        setRaca(perfilSalvo.raca);
        setIdade(perfilSalvo.idade);
        setPeso(perfilSalvo.peso);
        setClinica(perfilSalvo.clinica);
      }

      if (prefs) {
        setNotifAlertas(prefs.notifAlertas);
        setNotifPreventivo(prefs.notifPreventivo);
        setNotifRacao(prefs.notifRacao);
      }

      setPerfilCarregado(true);
    }
    carregarPerfilSalvo();
  }, []);

  async function salvarPerfil() {
    if (!nome || !especie || !raca || !idade || !peso || !clinica) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
      return;
    }
    try {
      await savePetProfile({ nome, especie, raca, idade, peso, clinica });
      await savePreferences({ notifAlertas, notifPreventivo, notifRacao });
      Alert.alert('Sucesso', 'Perfil do pet salvo no dispositivo.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o perfil do pet.');
    }
  }

  async function limparFormulario() {
    setNome('');
    setEspecie('');
    setRaca('');
    setIdade('');
    setPeso('');
    setClinica('');
    try {
      await removePetProfile();
      Alert.alert('Perfil removido', 'Os dados salvos foram apagados.');
    } catch {
      Alert.alert('Erro', 'Não foi possível remover os dados salvos.');
    }
  }

  if (!perfilCarregado) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Perfil do Pet"
          subtitle="Cadastre os dados principais do pet. Essas informações serão salvas localmente com AsyncStorage."
          level="page"
        />

        <StatusCard>
          <AppInput label="Nome do pet" placeholder="Ex: Rex" value={nome} onChangeText={setNome} />
          <AppInput label="Espécie" placeholder="Ex: Cachorro" value={especie} onChangeText={setEspecie} />
          <AppInput label="Raça" placeholder="Ex: Golden Retriever" value={raca} onChangeText={setRaca} />
          <AppInput label="Idade" placeholder="Ex: 4" value={idade} onChangeText={setIdade} keyboardType="numeric" />
          <AppInput label="Peso em kg" placeholder="Ex: 28.5" value={peso} onChangeText={setPeso} keyboardType="decimal-pad" />
          <AppInput label="Clínica vinculada" placeholder="Ex: Clínica Clyvo Vet" value={clinica} onChangeText={setClinica} />

          <Button label="Salvar perfil" onPress={salvarPerfil} style={styles.saveButton} />
          <Button label="Limpar dados salvos" variant="danger" onPress={limparFormulario} style={styles.clearButton} />
        </StatusCard>

        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Prévia em tempo real</Text>
          <Text style={styles.previewText}>Nome: <Text style={styles.previewStrong}>{nome || 'Não informado'}</Text></Text>
          <Text style={styles.previewText}>Espécie: <Text style={styles.previewStrong}>{especie || 'Não informada'}</Text></Text>
          <Text style={styles.previewText}>Raça: <Text style={styles.previewStrong}>{raca || 'Não informada'}</Text></Text>
          <Text style={styles.previewText}>Idade: <Text style={styles.previewStrong}>{idade || 'Não informada'}</Text></Text>
          <Text style={styles.previewText}>Peso: <Text style={styles.previewStrong}>{peso || 'Não informado'}</Text></Text>
          <Text style={styles.previewText}>Clínica: <Text style={styles.previewStrong}>{clinica || 'Não informada'}</Text></Text>
        </View>

        <StatusCard style={styles.prefsCard}>
          <Text style={styles.prefsTitle}>Preferências de notificação</Text>

          {[
            { label: 'Alertas de saúde', value: notifAlertas, toggle: () => setNotifAlertas((v) => !v) },
            { label: 'Lembretes preventivos', value: notifPreventivo, toggle: () => setNotifPreventivo((v) => !v) },
            { label: 'Alerta de ração baixa', value: notifRacao, toggle: () => setNotifRacao((v) => !v) },
          ].map(({ label, value, toggle }) => (
            <View key={label} style={styles.prefRow}>
              <Text style={styles.prefLabel}>{label}</Text>
              <TouchableOpacity onPress={toggle} style={[styles.toggle, value && styles.toggleActive]} activeOpacity={0.8}>
                <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
          ))}
        </StatusCard>

        <Button label="Sair da conta" variant="secondary" onPress={logout} style={styles.logoutButton} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.screenPadding, paddingTop: spacing.lg, paddingBottom: spacing['2xl'] },
  loadingContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  loadingText: { ...typography.body, color: colors.textSecondary },
  saveButton: { marginTop: spacing.xs },
  clearButton: { marginTop: spacing.md },
  previewCard: {
    backgroundColor: colors.blueLight,
    padding: spacing.cardPadding + 2,
    borderRadius: radius.cardMd,
    marginBottom: spacing.cardGap,
  },
  previewTitle: { ...typography.cardTitle, color: colors.bluePrimary, marginBottom: spacing.md },
  previewText: { ...typography.subtitle, fontWeight: '400', color: colors.textPrimary, marginBottom: spacing.xs + 2 },
  previewStrong: { fontWeight: '700' },
  prefsCard: { marginBottom: spacing.lg },
  logoutButton: { marginBottom: spacing.lg },
  prefsTitle: { ...typography.cardTitle, color: colors.textPrimary, marginBottom: spacing.md },
  prefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  prefLabel: { ...typography.body, color: colors.textPrimary, flex: 1 },
  toggle: { width: 44, height: 24, borderRadius: radius.pill, backgroundColor: colors.borderGray, padding: 2, justifyContent: 'center' },
  toggleActive: { backgroundColor: colors.greenPrimary },
  toggleThumb: { width: 20, height: 20, borderRadius: radius.pill, backgroundColor: colors.surface, alignSelf: 'flex-start' },
  toggleThumbActive: { alignSelf: 'flex-end' },
});
