import { StyleSheet, Text, View } from 'react-native';

export function PetProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Pet</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>Rex</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Espécie</Text>
        <Text style={styles.value}>Cachorro</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Raça</Text>
        <Text style={styles.value}>Golden Retriever</Text>
      </View>

      <Text style={styles.info}>
        Na próxima etapa, esta tela vai virar um formulário com useState e
        AsyncStorage.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0F172A', marginBottom: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 14, marginBottom: 12 },
  label: { fontSize: 14, color: '#64748B', marginBottom: 6 },
  value: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  info: { marginTop: 16, fontSize: 15, color: '#475569', lineHeight: 22 },
});