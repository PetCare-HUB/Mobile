import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AddReminderModal } from '../components/AddReminderModal';
import { Button } from '../components/Button';
import { QueryState } from '../components/QueryState';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { StatusCard } from '../components/StatusCard';
import { colors, radius, spacing, typography } from '../theme';
import { usePetContext } from '../contexts/pet/PetContext';
import { usePreventivePlan } from '../hooks/queries/usePreventivePlan';
import { useMarcarEventoRealizado } from '../hooks/mutations/useMarcarEventoRealizado';
import { TIPO_ICON, computeStreak, statusColor, statusLabel } from '../utils/preventiveMappers';
import type { EventoPreventivoResponse, TipoEventoPreventivo } from '../types/api';

type FilterKey = 'todos' | 'vacinas' | 'exames' | 'consultas' | 'medicamentos';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'vacinas', label: 'Vacinas' },
  { key: 'exames', label: 'Exames' },
  { key: 'consultas', label: 'Consultas' },
  { key: 'medicamentos', label: 'Medicamentos' },
];

const FILTER_TIPOS: Record<FilterKey, TipoEventoPreventivo[] | null> = {
  todos: null,
  vacinas: ['VACINA'],
  exames: ['CHECKUP'],
  consultas: ['RETORNO'],
  medicamentos: ['MEDICAMENTO', 'VERMIFUGO'],
};

export function PreventiveScreen() {
  const [filter, setFilter] = useState<FilterKey>('todos');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const {
    selectedPetId,
    isLoading: petsLoading,
    isError: petsError,
    error: petsErrorDetail,
    refetch: refetchPets,
  } = usePetContext();
  const planQuery = usePreventivePlan(selectedPetId);
  const marcarRealizado = useMarcarEventoRealizado();

  function handleTogglePress(evento: EventoPreventivoResponse) {
    if (evento.status === 'REALIZADO') return;

    Alert.alert(
      'Marcar como realizado?',
      `"${evento.descricao}" será marcado como concluído. Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () =>
            marcarRealizado.mutate(evento.id, {
              onError: (error) => {
                Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível concluir.');
              },
            }),
        },
      ]
    );
  }

  return (
    <ScreenContainer>
      <SectionHeader
        title="Calendário Preventivo"
        subtitle="Acompanhe vacinas, check-ups, vermífugos e medicamentos para manter a rotina de cuidado em dia."
        level="page"
      />

      <QueryState
        isLoading={petsLoading}
        isError={petsError}
        error={petsErrorDetail}
        data={selectedPetId}
        onRetry={refetchPets}
        emptyTitle="Nenhum pet cadastrado"
        emptyDescription="Assim que sua clínica vincular um pet à sua conta, ele aparece aqui."
      >
        {() => (
          <QueryState
            isLoading={planQuery.isLoading}
            isError={planQuery.isError}
            error={planQuery.error}
            data={planQuery.data}
            isEmpty={(eventos) => eventos.length === 0}
            onRetry={planQuery.refetch}
            emptyTitle="Nada no calendário ainda"
            emptyDescription="Toque em 'Adicionar lembrete' para criar o primeiro."
          >
            {(eventos) => {
              const totalItems = eventos.length;
              const completedItems = eventos.filter((e) => e.status === 'REALIZADO').length;
              const pendingItems = totalItems - completedItems;
              const streak = computeStreak(eventos);

              const tiposDoFiltro = FILTER_TIPOS[filter];
              const filteredEventos = tiposDoFiltro
                ? eventos.filter((e) => tiposDoFiltro.includes(e.tipo))
                : eventos;

              return (
                <>
                  <StatusCard>
                    <Text style={styles.summaryTitle}>Resumo preventivo</Text>
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryNumber}>{totalItems}</Text>
                        <Text style={styles.summaryLabel}>Total</Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <Text style={[styles.summaryNumber, { color: colors.success }]}>{completedItems}</Text>
                        <Text style={styles.summaryLabel}>Feitos</Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <Text style={[styles.summaryNumber, { color: colors.warning }]}>{pendingItems}</Text>
                        <Text style={styles.summaryLabel}>Pendentes</Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <Text style={[styles.summaryNumber, { color: colors.warning }]}>{streak}</Text>
                        <Text style={styles.summaryLabel}>Streak dias</Text>
                      </View>
                    </View>
                  </StatusCard>

                  <SegmentedControl segments={FILTERS} value={filter} onChange={setFilter} />

                  {filteredEventos.map((evento) => {
                    const color = statusColor(evento);
                    const done = evento.status === 'REALIZADO';
                    return (
                      <TouchableOpacity
                        key={evento.id}
                        style={[styles.row, done && styles.rowDone]}
                        onPress={() => handleTogglePress(evento)}
                        activeOpacity={done ? 1 : 0.8}
                      >
                        <View style={[styles.rowIcon, { backgroundColor: color }]}>
                          <MaterialCommunityIcons
                            name={done ? 'check' : TIPO_ICON[evento.tipo]}
                            size={16}
                            color={colors.surface}
                          />
                        </View>
                        <View style={styles.rowText}>
                          <Text style={styles.rowTitle}>{evento.descricao}</Text>
                          <Text style={[styles.rowDate, { color }]}>{statusLabel(evento)}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              );
            }}
          </QueryState>
        )}
      </QueryState>

      <Button
        label="Adicionar lembrete"
        onPress={() => setAddModalOpen(true)}
        disabled={!selectedPetId}
        style={styles.addButton}
      />

      {selectedPetId ? (
        <AddReminderModal visible={addModalOpen} petId={selectedPetId} onClose={() => setAddModalOpen(false)} />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryTitle: { ...typography.cardTitle, color: colors.textPrimary, marginBottom: spacing.md + 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryNumber: { ...typography.pageTitle, color: colors.bluePrimary },
  summaryLabel: { ...typography.secondaryInfo, color: colors.textSecondary, marginTop: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderGray,
    borderRadius: radius.cardSm,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  rowDone: { opacity: 0.7 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowText: { flex: 1 },
  rowTitle: { ...typography.subtitle, color: colors.textPrimary },
  rowDate: { ...typography.secondaryInfo, fontWeight: '600', marginTop: spacing.xs / 2 },
  addButton: { marginTop: spacing.md, marginBottom: spacing.lg },
});
