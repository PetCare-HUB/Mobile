import { ScrollView, StyleSheet, Text } from 'react-native';

import { PreventiveItem } from '../components/PreventiveItem';
import { preventiveItems } from '../data/mockData';

export function PreventiveScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Calendário Preventivo</Text>

      <Text style={styles.subtitle}>
        Acompanhe vacinas, check-ups, vermífugos e medicamentos para manter a
        rotina de cuidado em dia.
      </Text>

      {preventiveItems.map((item) => (
        <PreventiveItem
          key={item.id}
          title={item.title}
          date={item.date}
          description={item.description}
          done={item.done}
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
});