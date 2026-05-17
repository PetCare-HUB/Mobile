import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export function PetProfileScreen() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [clinica, setClinica] = useState('');

  function salvarPerfil() {
    if (!nome || !especie || !raca || !idade || !peso || !clinica) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
      return;
    }

    Alert.alert('Sucesso', 'Perfil do pet preenchido com sucesso!');
  }

  function limparFormulario() {
    setNome('');
    setEspecie('');
    setRaca('');
    setIdade('');
    setPeso('');
    setClinica('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Perfil do Pet</Text>

        <Text style={styles.subtitle}>
          Cadastre os dados principais do pet para personalizar o acompanhamento
          preventivo.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome do pet</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Rex"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Espécie</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Cachorro"
            value={especie}
            onChangeText={setEspecie}
          />

          <Text style={styles.label}>Raça</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Golden Retriever"
            value={raca}
            onChangeText={setRaca}
          />

          <Text style={styles.label}>Idade</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 4"
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Peso em kg</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 28.5"
            value={peso}
            onChangeText={setPeso}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Clínica vinculada</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Clínica Clyvo Vet"
            value={clinica}
            onChangeText={setClinica}
          />

          <TouchableOpacity style={styles.button} onPress={salvarPerfil}>
            <Text style={styles.buttonText}>Salvar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={limparFormulario}>
            <Text style={styles.clearButtonText}>Limpar formulário</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Prévia em tempo real</Text>

          <Text style={styles.previewText}>
            Nome: <Text style={styles.previewStrong}>{nome || 'Não informado'}</Text>
          </Text>

          <Text style={styles.previewText}>
            Espécie:{' '}
            <Text style={styles.previewStrong}>{especie || 'Não informada'}</Text>
          </Text>

          <Text style={styles.previewText}>
            Raça: <Text style={styles.previewStrong}>{raca || 'Não informada'}</Text>
          </Text>

          <Text style={styles.previewText}>
            Idade: <Text style={styles.previewStrong}>{idade || 'Não informada'}</Text>
          </Text>

          <Text style={styles.previewText}>
            Peso: <Text style={styles.previewStrong}>{peso || 'Não informado'}</Text>
          </Text>

          <Text style={styles.previewText}>
            Clínica:{' '}
            <Text style={styles.previewStrong}>{clinica || 'Não informada'}</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
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
    marginBottom: 24,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginTop: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  clearButtonText: {
    color: '#EF4444',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  previewCard: {
    backgroundColor: '#E0F2FE',
    padding: 18,
    borderRadius: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075985',
    marginBottom: 12,
  },
  previewText: {
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 6,
  },
  previewStrong: {
    fontWeight: 'bold',
  },
});