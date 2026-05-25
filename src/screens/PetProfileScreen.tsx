import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getPetProfile, removePetProfile, savePetProfile } from '../storage/petStorage';
import { getPreferences, savePreferences } from '../storage/preferencesStorage';

export function PetProfileScreen() {
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
      >
        <Text style={styles.title}>Perfil do Pet</Text>
        <Text style={styles.subtitle}>
          Cadastre os dados principais do pet. Essas informações serão salvas
          localmente com AsyncStorage.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome do pet</Text>
          <TextInput style={styles.input} placeholder="Ex: Rex" value={nome} onChangeText={setNome} />

          <Text style={styles.label}>Espécie</Text>
          <TextInput style={styles.input} placeholder="Ex: Cachorro" value={especie} onChangeText={setEspecie} />

          <Text style={styles.label}>Raça</Text>
          <TextInput style={styles.input} placeholder="Ex: Golden Retriever" value={raca} onChangeText={setRaca} />

          <Text style={styles.label}>Idade</Text>
          <TextInput style={styles.input} placeholder="Ex: 4" value={idade} onChangeText={setIdade} keyboardType="numeric" />

          <Text style={styles.label}>Peso em kg</Text>
          <TextInput style={styles.input} placeholder="Ex: 28.5" value={peso} onChangeText={setPeso} keyboardType="decimal-pad" />

          <Text style={styles.label}>Clínica vinculada</Text>
          <TextInput style={styles.input} placeholder="Ex: Clínica Clyvo Vet" value={clinica} onChangeText={setClinica} />

          <TouchableOpacity style={styles.button} onPress={salvarPerfil}>
            <Text style={styles.buttonText}>Salvar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={limparFormulario}>
            <Text style={styles.clearButtonText}>Limpar dados salvos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Prévia em tempo real</Text>
          <Text style={styles.previewText}>Nome: <Text style={styles.previewStrong}>{nome || 'Não informado'}</Text></Text>
          <Text style={styles.previewText}>Espécie: <Text style={styles.previewStrong}>{especie || 'Não informada'}</Text></Text>
          <Text style={styles.previewText}>Raça: <Text style={styles.previewStrong}>{raca || 'Não informada'}</Text></Text>
          <Text style={styles.previewText}>Idade: <Text style={styles.previewStrong}>{idade || 'Não informada'}</Text></Text>
          <Text style={styles.previewText}>Peso: <Text style={styles.previewStrong}>{peso || 'Não informado'}</Text></Text>
          <Text style={styles.previewText}>Clínica: <Text style={styles.previewStrong}>{clinica || 'Não informada'}</Text></Text>
        </View>

        <View style={styles.prefsCard}>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  loadingContainer: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, color: '#475569' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 24 },
  form: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 16, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, padding: 14, fontSize: 16, color: '#0F172A', marginBottom: 14, backgroundColor: '#FFFFFF' },
  button: { backgroundColor: '#2563EB', padding: 16, borderRadius: 12, marginTop: 6 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
  clearButton: { borderWidth: 1, borderColor: '#EF4444', padding: 16, borderRadius: 12, marginTop: 12 },
  clearButtonText: { color: '#EF4444', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
  previewCard: { backgroundColor: '#E0F2FE', padding: 18, borderRadius: 16, marginBottom: 16 },
  previewTitle: { fontSize: 18, fontWeight: 'bold', color: '#075985', marginBottom: 12 },
  previewText: { fontSize: 15, color: '#0F172A', marginBottom: 6 },
  previewStrong: { fontWeight: 'bold' },
  prefsCard: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 16, marginBottom: 16 },
  prefsTitle: { fontSize: 17, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  prefsSubtitle: { fontSize: 12, color: '#64748B', marginBottom: 16 },
  prefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  prefLabel: { fontSize: 15, color: '#334155', flex: 1 },
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: '#CBD5E1', padding: 2, justifyContent: 'center' },
  toggleActive: { backgroundColor: '#2563EB' },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF', alignSelf: 'flex-start' },
  toggleThumbActive: { alignSelf: 'flex-end' },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#166534', marginBottom: 6 },
  infoText: { fontSize: 14, color: '#166534', lineHeight: 20 },
});