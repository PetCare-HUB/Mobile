import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { PreventiveItem } from '../components/PreventiveItem';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { StatusCard } from '../components/StatusCard';
import { colors, spacing, typography } from '../theme';
import { getPreventiveItems, resetPreventiveItems, savePreventiveItems, getStreak } from '../storage/preventiveStorage';
import type { PreventiveItemType } from '../types/pet';

export function PreventiveScreen() {
  const [items, setItems] = useState<PreventiveItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

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

      {items.map((item) => (
        <PreventiveItem
          key={item.id}
          title={item.title}
          date={item.date}
          description={item.description}
          done={item.done}
          onToggle={() => toggleItemDone(item.id)}
        />
      ))}

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
  resetButton: { marginTop: spacing.sm, marginBottom: spacing.lg },
});
