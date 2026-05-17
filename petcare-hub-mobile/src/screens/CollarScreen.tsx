import { StyleSheet, Text, View } from 'react-native';

export function CollarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coleira Smart</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Status atual</Text>
        <Text style={styles.value}>🏃 Rex está ativo</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Bateria</Text>
        <Text style={styles.value}>78%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Resumo</Text>
        <Text style={styles.description}>
          A coleira monitora o nível de atividade do pet e ajuda a identificar
          mudanças no comportamento.
        </Text>
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
  description: { fontSize: 16, color: '#475569', lineHeight: 22 },
});