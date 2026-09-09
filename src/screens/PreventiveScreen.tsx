import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { StatusCard } from '../components/StatusCard';
import { colors, radius, spacing, typography } from '../theme';
import { getPreventiveItems, resetPreventiveItems, savePreventiveItems, getStreak } from '../storage/preventiveStorage';
import type { PreventiveItemType, PreventiveTipo } from '../types/pet';

type FilterKey = 'todos' | 'vacinas' | 'exames' | 'consultas' | 'medicamentos';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'vacinas', label: 'Vacinas' },
  { key: 'exames', label: 'Exames' },
  { key: 'consultas', label: 'Consultas' },
  { key: 'medicamentos', label: 'Medicamentos' },
];

const FILTER_TIPOS: Record<FilterKey, PreventiveTipo[] | null> = {
  todos: null,
  vacinas: ['VACINA'],
  exames: ['CHECKUP'],
  consultas: ['RETORNO'],
  medicamentos: ['MEDICAMENTO', 'VERMIFUGO'],
};

const TIPO_ICON: Record<PreventiveTipo, keyof typeof MaterialCommunityIcons.glyphMap> = {
  VACINA: 'needle',
  CHECKUP: 'stethoscope',
  VERMIFUGO: 'bug-outline',
  RETORNO: 'calendar-clock',
  MEDICAMENTO: 'pill',
};

function statusColor(item: PreventiveItemType) {
  if (item.done) return colors.success;
  if (item.overdue) return colors.danger;
  return colors.bluePrimary;
}

export function PreventiveScreen() {
  const [items, setItems] = useState<PreventiveItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [filter, setFilter] = useState<FilterKey>('todos');

  useEffect(() => {
    async function carregarItens() {
      const itensSalvos = await getPreventiveItems();
      const streakAtual = await getStreak();
      setItems(itensSalvos);
      setStreak(streakAtual);
      setLoading(false);
    }
    carregarItens();
  }, []);

  const totalItems = items.length;
  const completedItems = items.filter((item) => item.done).length;
  const pendingItems = totalItems - completedItems;

  const tiposDoFiltro = FILTER_TIPOS[filter];
  const filteredItems = tiposDoFiltro ? items.filter((item) => tiposDoFiltro.includes(item.tipo)) : items;

  async function toggleItemDone(id: number) {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setItems(updatedItems);
    await savePreventiveItems(updatedItems);
    setStreak(await getStreak());
  }

  async function resetarCalendario() {
    await resetPreventiveItems();
    const itensPadrao = await getPreventiveItems();
    const streakAtual = await getStreak();
    setItems(itensPadrao);
    setStreak(streakAtual);
    Alert.alert('Calendário resetado', 'Os itens preventivos voltaram ao estado inicial.');
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando calendário...</Text>
      </View>
    );
  }

  return (
    <ScreenContainer>
      <SectionHeader
        title="Calendário Preventivo"
        subtitle="Acompanhe vacinas, check-ups, vermífugos e medicamentos para manter a rotina de cuidado em dia."
        level="page"
      />

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

      {filteredItems.map((item) => {
        const color = statusColor(item);
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.row}
            onPress={() => toggleItemDone(item.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.rowIcon, { backgroundColor: color }]}>
              <MaterialCommunityIcons
                name={item.done ? 'check' : TIPO_ICON[item.tipo]}
                size={16}
                color={colors.surface}
              />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={[styles.rowDate, { color }]}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <Button
        label="Resetar calendário"
        variant="danger"
        onPress={resetarCalendario}
        style={styles.resetButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  loadingText: { ...typography.body, color: colors.textSecondary },
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
  resetButton: { marginTop: spacing.md, marginBottom: spacing.lg },
});
