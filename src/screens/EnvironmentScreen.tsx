import { StyleSheet, Text, View } from 'react-native';

export function EnvironmentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ambiente</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Temperatura</Text>
        <Text style={styles.value}>24°C</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Umidade</Text>
        <Text style={styles.value}>62%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Qualidade do ar</Text>
        <Text style={styles.value}>🟢 Boa</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Presença</Text>
        <Text style={styles.value}>Pet detectado no cômodo</Text>
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
});