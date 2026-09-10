import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button } from '../components/Button';
import { DeviceCard } from '../components/DeviceCard';
import { PetAvatar } from '../components/PetAvatar';
import { PetFormModal } from '../components/PetFormModal';
import { PetSwitcherModal } from '../components/PetSwitcherModal';
import { QueryState } from '../components/QueryState';
import { StatusCard } from '../components/StatusCard';
import { TutorFormModal } from '../components/TutorFormModal';
import { UnderlineTabs } from '../components/UnderlineTabs';
import { colors, radius, spacing, typography } from '../theme';
import { useAuth } from '../contexts/auth/AuthContext';
import { usePetContext } from '../contexts/pet/PetContext';
import { useLeiturasAmbiente } from '../hooks/queries/useLeiturasAmbiente';
import { useLeiturasColeira } from '../hooks/queries/useLeiturasColeira';
import { useLeiturasComedouro } from '../hooks/queries/useLeiturasComedouro';
import { usePetAlerts } from '../hooks/queries/usePetAlerts';
import { usePreventivePlan } from '../hooks/queries/usePreventivePlan';
import { useTutor } from '../hooks/queries/useTutor';
import { batteryColor, batteryIcon } from '../utils/leituraMappers';
import { ESPECIE_LABEL, SEXO_LABEL, calcularIdade } from '../utils/petMappers';
import { TIPO_LABEL, formatIsoDateBr } from '../utils/preventiveMappers';
import { getPreferences, savePreferences } from '../storage/preferencesStorage';

type ProfileTab = 'sobre' | 'tutor' | 'clinica' | 'dispositivos' | 'historico';

const PROFILE_TABS: { key: ProfileTab; label: string }[] = [
  { key: 'sobre', label: 'Sobre' },
  { key: 'tutor', label: 'Tutor' },
  { key: 'clinica', label: 'Clínica' },
  { key: 'dispositivos', label: 'Dispositivos' },
  { key: 'historico', label: 'Histórico' },
];

type HistoricoItem = { id: string; rawDate: string; dateLabel: string; title: string };

export function PetProfileScreen() {
  const { logout } = useAuth();
  const {
    pets,
    selectedPet,
    selectedPetId,
    setSelectedPetId,
    isLoading: petsLoading,
    isError: petsError,
    error: petsErrorDetail,
    refetch: refetchPets,
  } = usePetContext();
  const tutorQuery = useTutor();
  const coleiraQuery = useLeiturasColeira(selectedPetId);
  const comedouroQuery = useLeiturasComedouro(selectedPetId);
  const ambienteQuery = useLeiturasAmbiente(selectedPetId);
  const alertsQuery = usePetAlerts(selectedPetId);
  const preventiveQuery = usePreventivePlan(selectedPetId);

  const [tab, setTab] = useState<ProfileTab>('sobre');
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [petFormMode, setPetFormMode] = useState<'closed' | 'create' | 'edit'>('closed');
  const [tutorFormOpen, setTutorFormOpen] = useState(false);

  const [notifAlertas, setNotifAlertas] = useState(true);
  const [notifPreventivo, setNotifPreventivo] = useState(true);
  const [notifRacao, setNotifRacao] = useState(true);

  useEffect(() => {
    async function carregarPreferencias() {
      const prefs = await getPreferences();
      setNotifAlertas(prefs.notifAlertas);
      setNotifPreventivo(prefs.notifPreventivo);
      setNotifRacao(prefs.notifRacao);
    }
    carregarPreferencias();
  }, []);

  function togglePref(setter: (fn: (v: boolean) => boolean) => void, atual: boolean, chave: 'notifAlertas' | 'notifPreventivo' | 'notifRacao') {
    const novoValor = !atual;
    setter(() => novoValor);
    savePreferences({
      notifAlertas: chave === 'notifAlertas' ? novoValor : notifAlertas,
      notifPreventivo: chave === 'notifPreventivo' ? novoValor : notifPreventivo,
      notifRacao: chave === 'notifRacao' ? novoValor : notifRacao,
    });
  }

  const historico: HistoricoItem[] = [
    ...(alertsQuery.data ?? []).map((alerta) => ({
      id: `alerta-${alerta.id}`,
      rawDate: alerta.dataAlerta,
      dateLabel: formatIsoDateBr(alerta.dataAlerta.slice(0, 10)),
      title: alerta.mensagem,
    })),
    ...(preventiveQuery.data ?? [])
      .filter((evento) => evento.status === 'REALIZADO' && evento.dataRealizacao)
      .map((evento) => ({
        id: `preventivo-${evento.id}`,
        rawDate: evento.dataRealizacao as string,
        dateLabel: formatIsoDateBr(evento.dataRealizacao as string),
        title: `${TIPO_LABEL[evento.tipo]} concluído — ${evento.descricao}`,
      })),
  ].sort((a, b) => (a.rawDate < b.rawDate ? 1 : -1));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <QueryState
        isLoading={petsLoading}
        isError={petsError}
        error={petsErrorDetail}
        data={pets}
        isEmpty={(p) => p.length === 0}
        onRetry={refetchPets}
        emptyTitle="Nenhum pet cadastrado"
        emptyDescription="Assim que sua clínica vincular um pet à sua conta, ele aparece aqui."
      >
        {() => (
          <>
            <TouchableOpacity style={styles.headerRow} onPress={() => setSwitcherOpen(true)} activeOpacity={0.8}>
              <PetAvatar name={selectedPet?.nome ?? ''} size={64} />
              <View style={styles.headerText}>
                <View style={styles.headerNameRow}>
                  <Text style={styles.petName}>{selectedPet?.nome}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textSecondary} />
                </View>
                <Text style={styles.petSubtitle}>
                  {selectedPet ? ESPECIE_LABEL[selectedPet.especie] : ''} • {calcularIdade(selectedPet?.dataNascimento ?? null)}
                </Text>
              </View>
            </TouchableOpacity>

            <Button label="Editar pet" variant="secondary" onPress={() => setPetFormMode('edit')} style={styles.editButton} />

            <UnderlineTabs tabs={PROFILE_TABS} value={tab} onChange={setTab} />

            {tab === 'sobre' && selectedPet && (
              <>
                <View style={styles.grid}>
                  <InfoTile icon="paw-outline" label="Espécie" value={ESPECIE_LABEL[selectedPet.especie]} />
                  <InfoTile icon="tag-outline" label="Raça" value={selectedPet.raca || 'Não informado'} />
                  <InfoTile icon="weight-kilogram" label="Peso" value={selectedPet.pesoKg != null ? `${selectedPet.pesoKg} kg` : 'Não informado'} />
                  <InfoTile icon="gender-male-female" label="Sexo" value={selectedPet.sexo ? SEXO_LABEL[selectedPet.sexo] : 'Não informado'} />
                  <InfoTile icon="cake-variant-outline" label="Idade" value={calcularIdade(selectedPet.dataNascimento)} />
                </View>

                <Text style={styles.sectionTitle}>Condições crônicas</Text>
                <Text style={styles.observations}>{selectedPet.condicoesCronicas || 'Nenhuma condição crônica cadastrada.'}</Text>
              </>
            )}

            {tab === 'tutor' && (
              <QueryState
                isLoading={tutorQuery.isLoading}
                isError={tutorQuery.isError}
                error={tutorQuery.error}
                data={tutorQuery.data}
                onRetry={tutorQuery.refetch}
                emptyTitle="Dados do tutor indisponíveis"
              >
                {(tutor) => (
                  <StatusCard>
                    <InfoRow icon="account-outline" label="Nome" value={tutor.nome} />
                    <InfoRow icon="email-outline" label="E-mail" value={tutor.email} />
                    <InfoRow icon="phone-outline" label="Telefone" value={tutor.telefone} />
                    <Button label="Editar meus dados" variant="secondary" onPress={() => setTutorFormOpen(true)} style={styles.tutorEditButton} />
                  </StatusCard>
                )}
              </QueryState>
            )}

            {tab === 'clinica' && selectedPet && (
              <StatusCard>
                <View style={styles.clinicRow}>
                  <View style={styles.clinicIcon}>
                    <MaterialCommunityIcons name="hospital-box-outline" size={20} color={colors.greenPrimary} />
                  </View>
                  <View>
                    <Text style={styles.clinicLabel}>Clínica responsável</Text>
                    <Text style={styles.clinicValue}>{selectedPet.clinica.nome}</Text>
                  </View>
                </View>
              </StatusCard>
            )}

            {tab === 'dispositivos' && (
              <>
                <QueryState isLoading={coleiraQuery.isLoading} isError={coleiraQuery.isError} error={coleiraQuery.error} data={coleiraQuery.data}>
                  {(leituras) => (
                    <DeviceCard
                      icon="watch-variant"
                      title="Coleira Smart"
                      connected={leituras.length > 0}
                      rightIcon={leituras[0] ? batteryIcon(leituras[0].nivelBateria) : undefined}
                      rightIconColor={leituras[0] ? batteryColor(leituras[0].nivelBateria) : undefined}
                      rightValue={leituras[0] ? `${leituras[0].nivelBateria}%` : undefined}
                    />
                  )}
                </QueryState>
                <QueryState isLoading={comedouroQuery.isLoading} isError={comedouroQuery.isError} error={comedouroQuery.error} data={comedouroQuery.data}>
                  {(leituras) => <DeviceCard icon="bowl-mix-outline" title="Comedouro Inteligente" connected={leituras.length > 0} />}
                </QueryState>
                <QueryState isLoading={ambienteQuery.isLoading} isError={ambienteQuery.isError} error={ambienteQuery.error} data={ambienteQuery.data}>
                  {(leituras) => <DeviceCard icon="home-thermometer-outline" title="Sensor de Ambiente" connected={leituras.length > 0} />}
                </QueryState>
              </>
            )}

            {tab === 'historico' && (
              <QueryState
                isLoading={alertsQuery.isLoading || preventiveQuery.isLoading}
                isError={alertsQuery.isError || preventiveQuery.isError}
                error={alertsQuery.error ?? preventiveQuery.error}
                data={historico}
                isEmpty={(items) => items.length === 0}
                emptyTitle="Nenhum evento registrado ainda"
              >
                {(items) => (
                  <View>
                    {items.map((event) => (
                      <View key={event.id} style={styles.timelineRow}>
                        <View style={styles.timelineDot} />
                        <Text style={styles.timelineDate}>{event.dateLabel}</Text>
                        <Text style={styles.timelineTitle}>{event.title}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </QueryState>
            )}
          </>
        )}
      </QueryState>

      <StatusCard style={styles.prefsCard}>
        <Text style={styles.prefsTitle}>Preferências de notificação</Text>

        {[
          { chave: 'notifAlertas' as const, label: 'Alertas de saúde', value: notifAlertas, setter: setNotifAlertas },
          { chave: 'notifPreventivo' as const, label: 'Lembretes preventivos', value: notifPreventivo, setter: setNotifPreventivo },
          { chave: 'notifRacao' as const, label: 'Alerta de ração baixa', value: notifRacao, setter: setNotifRacao },
        ].map(({ chave, label, value, setter }) => (
          <View key={label} style={styles.prefRow}>
            <Text style={styles.prefLabel}>{label}</Text>
            <TouchableOpacity
              onPress={() => togglePref(setter, value, chave)}
              style={[styles.toggle, value && styles.toggleActive]}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
        ))}
      </StatusCard>

      <Button label="Sair da conta" variant="secondary" onPress={logout} style={styles.logoutButton} />

      <PetSwitcherModal
        visible={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
        pets={pets}
        selectedPetId={selectedPetId}
        onSelect={setSelectedPetId}
        onAddPet={() => setPetFormMode('create')}
      />

      <PetFormModal
        visible={petFormMode !== 'closed'}
        onClose={() => setPetFormMode('closed')}
        mode={petFormMode === 'create' ? 'create' : 'edit'}
        pet={petFormMode === 'edit' ? selectedPet ?? undefined : undefined}
        defaultClinicaId={pets[0]?.clinica.id ?? null}
      />

      {tutorQuery.data ? (
        <TutorFormModal visible={tutorFormOpen} onClose={() => setTutorFormOpen(false)} tutor={tutorQuery.data} />
      ) : null}
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

function InfoRow({ icon, label, value }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoRowIcon}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.greenPrimary} />
      </View>
      <View>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={styles.infoRowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.screenPadding, paddingTop: spacing.lg, paddingBottom: spacing['2xl'] },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  headerText: { marginLeft: spacing.md },
  headerNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
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
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  infoRowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  infoRowLabel: { ...typography.secondaryInfo, color: colors.textSecondary },
  infoRowValue: { ...typography.subtitle, color: colors.textPrimary, marginTop: spacing.xs / 2 },
  tutorEditButton: { marginTop: spacing.sm },
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
