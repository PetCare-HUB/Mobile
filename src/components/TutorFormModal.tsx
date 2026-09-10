import { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAtualizarTutor } from '../hooks/mutations/useAtualizarTutor';
import { colors, radius, spacing, typography } from '../theme';
import { formatCpf } from '../utils/formatters';
import type { TutorResponse } from '../types/api';
import { AppInput } from './AppInput';
import { Button } from './Button';
import { FieldLabel } from './FieldLabel';

type TutorFormModalProps = {
  visible: boolean;
  onClose: () => void;
  tutor: TutorResponse;
};

export function TutorFormModal({ visible, onClose, tutor }: TutorFormModalProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const mutation = useAtualizarTutor();

  useEffect(() => {
    if (!visible) return;
    setNome(tutor.nome);
    setEmail(tutor.email);
    setTelefone(tutor.telefone);
  }, [visible, tutor]);

  function handleSalvar() {
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e telefone.');
      return;
    }

    mutation.mutate(
      { nome: nome.trim(), email: email.trim(), telefone: telefone.trim(), cpf: tutor.cpf },
      {
        onSuccess: () => onClose(),
        onError: (error) => {
          Alert.alert('Erro ao salvar', error instanceof Error ? error.message : 'Tente novamente.');
        },
      }
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar meus dados</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <AppInput label="Nome" placeholder="Seu nome" value={nome} onChangeText={setNome} icon="account-outline" required />
          <AppInput
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="email-outline"
            required
          />
          <AppInput
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            icon="phone-outline"
            required
          />

          <View style={styles.cpfRow}>
            <FieldLabel text="CPF" />
            <Text style={styles.cpfValue}>{formatCpf(tutor.cpf)}</Text>
          </View>

          <Button label="Salvar" onPress={handleSalvar} loading={mutation.isPending} style={styles.saveButton} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(21, 52, 73, 0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.cardLg,
    borderTopRightRadius: radius.cardLg,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { ...typography.cardTitle, color: colors.textPrimary },
  cpfRow: { marginBottom: spacing.md },
  cpfValue: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  saveButton: { marginTop: spacing.xs },
});
