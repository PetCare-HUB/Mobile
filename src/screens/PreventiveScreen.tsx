import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PreventiveItem } from '../components/PreventiveItem';
import { preventiveItems } from '../data/mockData';

export function PreventiveScreen() {
  const [items, setItems] = useState(preventiveItems);

  const totalItems = items.length;
  const completedItems = items.filter((item) => item.done).length;
  const pendingItems = totalItems - completedItems;

  function toggleItemDone(id: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
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
            <Text style={styles.summaryNumber}>{completedItems}</Text>
            <Text style={styles.summaryLabel}>Feitos</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{pendingItems}</Text>
            <Text style={styles.summaryLabel}>Pendentes</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
});