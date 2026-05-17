import { StyleSheet, Text, View } from 'react-native';

export function FeederScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comedouro Inteligente</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nível de ração</Text>
        <Text style={styles.value}>35%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Consumo de hoje</Text>
        <Text style={styles.value}>220g</Text>
      </View>

      <View style={styles.alertCard}>
        <Text style={styles.alertText}>⚠️ Atenção: nível de ração abaixo do ideal.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0F172A', marginBottom: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 14, marginBottom: 12 },
  label: { fontSize: 14, color: '#64748B', marginBottom: 6 },
  value: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  alertCard: { backgroundColor: '#FEF3C7', padding: 18, borderRadius: 14 },
  alertText: { color: '#92400E', fontWeight: '600', fontSize: 16 },
});