import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PreventiveItem } from '../components/PreventiveItem';
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Calendário Preventivo</Text>
      <Text style={styles.subtitle}>
        Acompanhe vacinas, check-ups, vermífugos e medicamentos para manter a
        rotina de cuidado em dia.
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumo preventivo</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{totalItems}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#16A34A' }]}>{completedItems}</Text>
            <Text style={styles.summaryLabel}>Feitos</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#D97706' }]}>{pendingItems}</Text>
            <Text style={styles.summaryLabel}>Pendentes</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#F59E0B' }]}> {streak}</Text>
            <Text style={styles.summaryLabel}>Streak dias</Text>
          </View>
        </View>
      </View>

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

      <TouchableOpacity style={styles.resetButton} onPress={resetarCalendario}>
        <Text style={styles.resetButtonText}>Resetar calendário</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Persistência local ativa</Text>
        <Text style={styles.infoText}>
          Os status e o streak de adesão são salvos com AsyncStorage e continuam
          após recarregar o aplicativo.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, paddingBottom: 40 },
  loadingContainer: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, color: '#475569' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 20 },
  summaryCard: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 16, marginBottom: 20 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryNumber: { fontSize: 26, fontWeight: 'bold', color: '#2563EB' },
  summaryLabel: { fontSize: 13, color: '#64748B', marginTop: 4 },
  resetButton: { borderWidth: 1, borderColor: '#EF4444', padding: 16, borderRadius: 14, marginTop: 8, marginBottom: 16 },
  resetButtonText: { color: '#EF4444', fontWeight: 'bold', textAlign: 'center', fontSize: 15 },
  infoCard: { backgroundColor: '#DCFCE7', padding: 16, borderRadius: 16 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#166534', marginBottom: 6 },
  infoText: { fontSize: 14, color: '#166534', lineHeight: 20 },
});