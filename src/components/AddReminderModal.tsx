import { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useCriarEventoPreventivo } from '../hooks/mutations/useCriarEventoPreventivo';
import { colors, radius, spacing, typography } from '../theme';
import { TIPO_LABEL, isValidIsoDate, todayIsoDate } from '../utils/preventiveMappers';
import type { TipoEventoPreventivo } from '../types/api';
import { AppInput } from './AppInput';
import { Button } from './Button';
import { SegmentedControl } from './SegmentedControl';

const TIPO_SEGMENTS: { key: TipoEventoPreventivo; label: string }[] = (
  Object.keys(TIPO_LABEL) as TipoEventoPreventivo[]
).map((key) => ({ key, label: TIPO_LABEL[key] }));

type AddReminderModalProps = {
  visible: boolean;
  petId: number;
  onClose: () => void;
};

export function AddReminderModal({ visible, petId, onClose }: AddReminderModalProps) {
  const [tipo, setTipo] = useState<TipoEventoPreventivo>('VACINA');
  const [descricao, setDescricao] = useState('');
  const [dataPrevista, setDataPrevista] = useState(todayIsoDate());
  const [dateError, setDateError] = useState<string | null>(null);
  const mutation = useCriarEventoPreventivo();

  function resetForm() {
    setTipo('VACINA');
    setDescricao('');
    setDataPrevista(todayIsoDate());
    setDateError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSalvar() {
    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Preencha a descrição do lembrete.');
      return;
    }
    if (!isValidIsoDate(dataPrevista)) {
      setDateError('Data inválida. Use o formato AAAA-MM-DD.');
      return;
    }
    if (dataPrevista < todayIsoDate()) {
      setDateError('A data precisa ser hoje ou no futuro.');
      return;
    }
    setDateError(null);

    mutation.mutate(
      { petId, tipo, descricao: descricao.trim(), dataPrevista },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
        onError: (error) => {
          Alert.alert('Erro ao criar lembrete', error instanceof Error ? error.message : 'Tente novamente.');
        },
      }
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar lembrete</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Tipo</Text>
          <SegmentedControl segments={TIPO_SEGMENTS} value={tipo} onChange={setTipo} />

          <AppInput
            label="Descrição"
            placeholder="Ex: Reforço da vacina V10"
            value={descricao}
            onChangeText={setDescricao}
            required
          />

          <AppInput
            label="Data prevista"
            placeholder="AAAA-MM-DD"
            value={dataPrevista}
            onChangeText={(text) => {
              setDataPrevista(text);
              setDateError(null);
            }}
            keyboardType="numeric"
            required
          />
          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

          <Button
            label="Salvar lembrete"
            onPress={handleSalvar}
            loading={mutation.isPending}
            style={styles.submitButton}
          />
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
  label: { ...typography.secondaryInfo, color: colors.textSecondary, marginBottom: spacing.xs },
  errorText: { ...typography.caption, color: colors.danger, marginTop: -spacing.sm, marginBottom: spacing.md },
  submitButton: { marginTop: spacing.sm },
});
