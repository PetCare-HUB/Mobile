import { StyleSheet, Text, View } from 'react-native';

export function PreventiveScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendário Preventivo</Text>

      <View style={styles.card}>
        <Text style={styles.itemTitle}>Vacina V10</Text>
        <Text style={styles.itemText}>Próxima dose: 25/05/2026</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.itemTitle}>Check-up anual</Text>
        <Text style={styles.itemText}>Agendado para: 10/06/2026</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.itemTitle}>Vermífugo</Text>
        <Text style={styles.itemText}>Pendente nos próximos 7 dias</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0F172A', marginBottom: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 14, marginBottom: 12 },
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  itemText: { fontSize: 15, color: '#475569', marginTop: 6 },
});