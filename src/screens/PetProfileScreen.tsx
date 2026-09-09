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
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppInput } from '../components/AppInput';
import { BreedPicker } from '../components/BreedPicker';
import { Button } from '../components/Button';
import { DeviceCard } from '../components/DeviceCard';
import { EmptyState } from '../components/EmptyState';
import { FieldLabel } from '../components/FieldLabel';
import { PetAvatar } from '../components/PetAvatar';
import { SectionHeader } from '../components/SectionHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { StatusCard } from '../components/StatusCard';
import { UnderlineTabs } from '../components/UnderlineTabs';
import { colors, radius, spacing, typography } from '../theme';
import { useAuth } from '../contexts/auth/AuthContext';
import { catBreeds, dogBreeds } from '../data/breeds';
import { collarActivity, environmentSummary, feederConsumption, petTimeline } from '../data/mockData';
import { getPetProfile, removePetProfile, savePetProfile } from '../storage/petStorage';
import { getPreferences, savePreferences } from '../storage/preferencesStorage';

type ProfileTab = 'sobre' | 'clinica' | 'dispositivos' | 'historico';

const PROFILE_TABS: { key: ProfileTab; label: string }[] = [
  { key: 'sobre', label: 'Sobre' },
  { key: 'clinica', label: 'Clínica' },
  { key: 'dispositivos', label: 'Dispositivos' },
  { key: 'historico', label: 'Histórico' },
];

type EspecieKey = 'Cão' | 'Gato' | 'Outro';
const ESPECIE_OPTIONS: { key: EspecieKey; label: string }[] = [
  { key: 'Cão', label: 'Cão' },
  { key: 'Gato', label: 'Gato' },
  { key: 'Outro', label: 'Outro' },
];

type SexoKey = 'Macho' | 'Fêmea';
const SEXO_OPTIONS: { key: SexoKey; label: string }[] = [
  { key: 'Macho', label: 'Macho' },
  { key: 'Fêmea', label: 'Fêmea' },
];

export function PetProfileScreen() {
  const { logout } = useAuth();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [tab, setTab] = useState<ProfileTab>('sobre');

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [clinica, setClinica] = useState('');
  const [sexo, setSexo] = useState('');
  const [microchip, setMicrochip] = useState('');
  const [observacoes, setObservacoes] = useState('');
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
        setSexo(perfilSalvo.sexo ?? '');
        setMicrochip(perfilSalvo.microchip ?? '');
        setObservacoes(perfilSalvo.observacoes ?? '');
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
      await savePetProfile({ nome, especie, raca, idade, peso, clinica, sexo, microchip, observacoes });
      await savePreferences({ notifAlertas, notifPreventivo, notifRacao });
      setMode('view');
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
    setSexo('');
    setMicrochip('');
    setObservacoes('');
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

  const temPerfil = Boolean(nome);

  if (mode === 'edit') {
    return (
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SectionHeader
            title="Editar perfil"
            subtitle="Essas informações serão salvas localmente com AsyncStorage."
            level="page"
          />

          <StatusCard>
            <AppInput label="Nome do pet" placeholder="Ex: Rex" value={nome} onChangeText={setNome} icon="paw-outline" required />

            <View style={styles.fieldGroup}>
              <FieldLabel text="Espécie" required />
              <SegmentedControl
                segments={ESPECIE_OPTIONS}
                value={(especie as EspecieKey) || 'Cão'}
                onChange={setEspecie}
              />
            </View>

            {especie === 'Outro' ? (
              <AppInput label="Raça" placeholder="Ex: Furão" value={raca} onChangeText={setRaca} icon="tag-outline" required />
            ) : (
              <BreedPicker
                label="Raça"
                value={raca}
                onChange={setRaca}
                options={especie === 'Gato' ? catBreeds : dogBreeds}
                required
              />
            )}

            <AppInput label="Idade" placeholder="Ex: 4" value={idade} onChangeText={setIdade} keyboardType="numeric" icon="cake-variant-outline" required />
            <AppInput label="Peso em kg" placeholder="Ex: 28.5" value={peso} onChangeText={setPeso} keyboardType="decimal-pad" icon="weight-kilogram" required />

            <View style={styles.fieldGroup}>
              <FieldLabel text="Sexo" required={false} />
              <SegmentedControl
                segments={SEXO_OPTIONS}
                value={(sexo as SexoKey) || 'Macho'}
                onChange={setSexo}
              />
            </View>

            <AppInput label="Microchip" placeholder="Ex: 98S112004567890" value={microchip} onChangeText={setMicrochip} icon="chip" required={false} />
            <AppInput label="Clínica vinculada" placeholder="Ex: Clínica Clyvo Vet" value={clinica} onChangeText={setClinica} icon="hospital-box-outline" required />
            <AppInput label="Informações adicionais" placeholder="Temperamento, alergias..." value={observacoes} onChangeText={setObservacoes} icon="note-text-outline" required={false} />

            <Button label="Salvar perfil" onPress={salvarPerfil} style={styles.saveButton} />
            <Button label="Cancelar" variant="secondary" onPress={() => setMode('view')} style={styles.cancelButton} />
            <Button label="Limpar dados salvos" variant="danger" onPress={limparFormulario} style={styles.clearButton} />
          </StatusCard>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {!temPerfil ? (
        <EmptyState
          title="Nenhum pet cadastrado"
          description="Cadastre os dados do seu pet para ver o perfil completo."
          icon="paw-outline"
        />
      ) : (
        <View style={styles.headerRow}>
          <PetAvatar name={nome} size={64} />
          <View style={styles.headerText}>
            <Text style={styles.petName}>{nome}</Text>
            <Text style={styles.petSubtitle}>{raca || especie} • {idade} anos</Text>
          </View>
        </View>
      )}

      <Button label="Editar" variant="secondary" onPress={() => setMode('edit')} style={styles.editButton} />

      {temPerfil && (
        <>
          <UnderlineTabs tabs={PROFILE_TABS} value={tab} onChange={setTab} />

          {tab === 'sobre' && (
            <>
              <View style={styles.grid}>
                <InfoTile icon="paw-outline" label="Espécie" value={especie} />
                <InfoTile icon="tag-outline" label="Raça" value={raca} />
                <InfoTile icon="weight-kilogram" label="Peso" value={`${peso} kg`} />
                <InfoTile icon="gender-male-female" label="Sexo" value={sexo || 'Não informado'} />
                <InfoTile icon="cake-variant-outline" label="Idade" value={`${idade} anos`} />
                <InfoTile icon="chip" label="Microchip" value={microchip || 'Não informado'} />
              </View>

              <Text style={styles.sectionTitle}>Informações adicionais</Text>
              <Text style={styles.observations}>{observacoes || 'Nenhuma informação adicional cadastrada.'}</Text>
            </>
          )}

          {tab === 'clinica' && (
            <StatusCard>
              <View style={styles.clinicRow}>
                <View style={styles.clinicIcon}>
                  <MaterialCommunityIcons name="hospital-box-outline" size={20} color={colors.greenPrimary} />
                </View>
                <View>
                  <Text style={styles.clinicLabel}>Clínica responsável</Text>
                  <Text style={styles.clinicValue}>{clinica || 'Nenhuma clínica vinculada'}</Text>
                </View>
              </View>
            </StatusCard>
          )}

          {tab === 'dispositivos' && (
            <>
              <DeviceCard icon="watch-variant" title="Coleira Smart" connected={collarActivity.connected} rightIcon="battery-high" rightValue={`${collarActivity.battery}%`} />
              <DeviceCard icon="bowl-mix-outline" title="Comedouro Inteligente" connected={feederConsumption.connected} />
              <DeviceCard icon="home-thermometer-outline" title="Sensor de Ambiente" connected={environmentSummary.connected} />
            </>
          )}

          {tab === 'historico' && (
            <View>
              {petTimeline.map((event) => (
                <View key={event.id} style={styles.timelineRow}>
                  <View style={styles.timelineDot} />
                  <Text style={styles.timelineDate}>{event.date}</Text>
                  <Text style={styles.timelineTitle}>{event.title}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}

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
  );
}

function InfoTile({ icon, label, value }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoTile}>
      <View style={styles.infoTileIcon}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.greenPrimary} />
      </View>
      <Text style={styles.infoTileLabel}>{label}</Text>
      <Text style={styles.infoTileValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.screenPadding, paddingTop: spacing.lg, paddingBottom: spacing['2xl'] },
  loadingContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  loadingText: { ...typography.body, color: colors.textSecondary },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  headerText: { marginLeft: spacing.md },
  petName: { ...typography.pageTitle, color: colors.textPrimary },
  petSubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs / 2 },
  editButton: { alignSelf: 'flex-start', paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm + 2, marginBottom: spacing.lg },
  infoTile: {
    width: '47%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: radius.cardSm,
    padding: spacing.md,
  },
  infoTileIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  infoTileLabel: { ...typography.secondaryInfo, color: colors.textSecondary },
  infoTileValue: { ...typography.subtitle, color: colors.textPrimary, marginTop: spacing.xs / 2 },
  sectionTitle: { ...typography.cardTitle, color: colors.textPrimary, marginBottom: spacing.sm },
  observations: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  clinicRow: { flexDirection: 'row', alignItems: 'center' },
  clinicIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  clinicLabel: { ...typography.secondaryInfo, color: colors.textSecondary },
  clinicValue: { ...typography.subtitle, color: colors.textPrimary, marginTop: spacing.xs / 2 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  timelineDot: { width: 8, height: 8, borderRadius: radius.pill, backgroundColor: colors.greenPrimary, marginRight: spacing.md },
  timelineDate: { ...typography.secondaryInfo, color: colors.textSecondary, width: 56 },
  timelineTitle: { ...typography.body, color: colors.textPrimary, flex: 1 },
  fieldGroup: { marginBottom: spacing.md },
  saveButton: { marginTop: spacing.xs },
  cancelButton: { marginTop: spacing.md },
  clearButton: { marginTop: spacing.md },
  prefsCard: { marginTop: spacing.lg, marginBottom: spacing.lg },
  logoutButton: { marginBottom: spacing.lg },
  prefsTitle: { ...typography.cardTitle, color: colors.textPrimary, marginBottom: spacing.md },
  prefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  prefLabel: { ...typography.body, color: colors.textPrimary, flex: 1 },
  toggle: { width: 44, height: 24, borderRadius: radius.pill, backgroundColor: colors.borderGray, padding: 2, justifyContent: 'center' },
  toggleActive: { backgroundColor: colors.greenPrimary },
  toggleThumb: { width: 20, height: 20, borderRadius: radius.pill, backgroundColor: colors.surface, alignSelf: 'flex-start' },
  toggleThumbActive: { alignSelf: 'flex-end' },
});
