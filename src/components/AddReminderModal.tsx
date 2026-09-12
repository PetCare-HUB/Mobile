import { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAtualizarEventoPreventivo } from '../hooks/mutations/useAtualizarEventoPreventivo';
import { useCriarEventoPreventivo } from '../hooks/mutations/useCriarEventoPreventivo';
import { useExcluirEventoPreventivo } from '../hooks/mutations/useExcluirEventoPreventivo';
import { colors, radius, spacing, typography } from '../theme';
import { TIPO_LABEL, isValidIsoDate, todayIsoDate } from '../utils/preventiveMappers';
import type { EventoPreventivoResponse, TipoEventoPreventivo } from '../types/api';
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
  mode?: 'create' | 'edit';
  evento?: EventoPreventivoResponse;
};

export function AddReminderModal({ visible, petId, onClose, mode = 'create', evento }: AddReminderModalProps) {
  const [tipo, setTipo] = useState<TipoEventoPreventivo>('VACINA');
  const [descricao, setDescricao] = useState('');
  const [dataPrevista, setDataPrevista] = useState(todayIsoDate());
  const [dateError, setDateError] = useState<string | null>(null);
  const criarMutation = useCriarEventoPreventivo();
  const atualizarMutation = useAtualizarEventoPreventivo(petId);
  const excluirMutation = useExcluirEventoPreventivo(petId);
  const mutation = mode === 'create' ? criarMutation : atualizarMutation;

  useEffect(() => {
    if (!visible) return;
    setTipo(evento?.tipo ?? 'VACINA');
    setDescricao(evento?.descricao ?? '');
    setDataPrevista(evento?.dataPrevista ?? todayIsoDate());
    setDateError(null);
  }, [visible, evento]);

  function handleClose() {
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
      // O Java exige data prevista hoje ou no futuro tanto ao criar quanto ao
      // editar (mesma regra @FutureOrPresent nos dois DTOs) — um lembrete
      // atrasado precisa ganhar uma nova data antes de poder ser salvo.
      setDateError('A data precisa ser hoje ou no futuro — atualize antes de salvar.');
      return;
    }
    setDateError(null);

    if (mode === 'create') {
      criarMutation.mutate(
        { petId, tipo, descricao: descricao.trim(), dataPrevista },
        {
          onSuccess: () => onClose(),
          onError: (error) => {
            Alert.alert('Erro ao criar lembrete', error instanceof Error ? error.message : 'Tente novamente.');
          },
        }
      );
      return;
    }

    atualizarMutation.mutate(
      { eventoId: evento!.id, payload: { tipo, descricao: descricao.trim(), dataPrevista } },
      {
        onSuccess: () => onClose(),
        onError: (error) => {
          Alert.alert('Erro ao salvar lembrete', error instanceof Error ? error.message : 'Tente novamente.');
        },
      }
    );
  }

  function handleExcluir() {
    if (!evento) return;
    Alert.alert(
      'Excluir lembrete?',
      `"${evento.descricao}" será excluído. Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () =>
            excluirMutation.mutate(evento.id, {
              onSuccess: () => onClose(),
              onError: (error) => {
                Alert.alert('Erro ao excluir', error instanceof Error ? error.message : 'Tente novamente.');
              },
            }),
        },
      ]
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{mode === 'create' ? 'Adicionar lembrete' : 'Editar lembrete'}</Text>
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
            maxLength={300}
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
          {mode === 'edit' ? (
            <Text style={styles.hintText}>
              A data precisa ser hoje ou no futuro — se o lembrete estiver atrasado, atualize a data pra poder salvar.
            </Text>
          ) : null}
          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

          <Button
            label={mode === 'create' ? 'Salvar lembrete' : 'Salvar alterações'}
            onPress={handleSalvar}
            loading={mutation.isPending}
            style={styles.submitButton}
          />

          {mode === 'edit' ? (
            <Button
              label="Excluir lembrete"
              variant="danger"
              onPress={handleExcluir}
              loading={excluirMutation.isPending}
              style={styles.deleteButton}
            />
          ) : null}
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
  hintText: { ...typography.caption, color: colors.textSecondary, marginTop: -spacing.sm, marginBottom: spacing.md },
  submitButton: { marginTop: spacing.sm },
  deleteButton: { marginTop: spacing.sm, marginBottom: spacing.sm },
});
