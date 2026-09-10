import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAtualizarPet } from '../hooks/mutations/useAtualizarPet';
import { useCriarPet } from '../hooks/mutations/useCriarPet';
import { useExcluirPet } from '../hooks/mutations/useExcluirPet';
import { usePetContext } from '../contexts/pet/PetContext';
import { colors, radius, spacing, typography } from '../theme';
import { catBreeds, dogBreeds } from '../data/breeds';
import { ESPECIE_LABEL, SEXO_LABEL, isValidBirthDate } from '../utils/petMappers';
import type { Especie, PetResponse, Sexo } from '../types/api';
import { AppInput } from './AppInput';
import { BreedPicker } from './BreedPicker';
import { Button } from './Button';
import { FieldLabel } from './FieldLabel';
import { SegmentedControl } from './SegmentedControl';

const ESPECIE_SEGMENTS: { key: Especie; label: string }[] = (Object.keys(ESPECIE_LABEL) as Especie[]).map((key) => ({
  key,
  label: ESPECIE_LABEL[key],
}));

const SEXO_SEGMENTS: { key: Sexo; label: string }[] = (Object.keys(SEXO_LABEL) as Sexo[]).map((key) => ({
  key,
  label: SEXO_LABEL[key],
}));

type PetFormModalProps = {
  visible: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  pet?: PetResponse;
  defaultClinicaId?: number | null;
};

function parsePeso(value: string): number | null {
  const trimmed = value.trim().replace(',', '.');
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : NaN;
}

export function PetFormModal({ visible, onClose, mode, pet, defaultClinicaId }: PetFormModalProps) {
  const { setSelectedPetId } = usePetContext();
  const criarPet = useCriarPet();
  const atualizarPet = useAtualizarPet();
  const excluirPet = useExcluirPet();

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState<Especie>('CAO');
  const [raca, setRaca] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [peso, setPeso] = useState('');
  const [sexo, setSexo] = useState<Sexo>('M');
  const [condicoesCronicas, setCondicoesCronicas] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);
  const [pesoError, setPesoError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setNome(pet?.nome ?? '');
    setEspecie(pet?.especie ?? 'CAO');
    setRaca(pet?.raca ?? '');
    setDataNascimento(pet?.dataNascimento ?? '');
    setPeso(pet?.pesoKg != null ? String(pet.pesoKg) : '');
    setSexo(pet?.sexo ?? 'M');
    setCondicoesCronicas(pet?.condicoesCronicas ?? '');
    setDateError(null);
    setPesoError(null);
  }, [visible, pet]);

  const clinicaId = mode === 'edit' ? pet?.clinica.id : defaultClinicaId;
  const semClinicaDisponivel = mode === 'create' && clinicaId == null;
  const mutation = mode === 'create' ? criarPet : atualizarPet;

  function handleSalvar() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Preencha o nome do pet.');
      return;
    }

    if (dataNascimento.trim() && !isValidBirthDate(dataNascimento.trim())) {
      setDateError('Data inválida. Use AAAA-MM-DD, sem datas futuras nem acima de 25 anos.');
      return;
    }
    setDateError(null);

    const pesoParsed = parsePeso(peso);
    if (Number.isNaN(pesoParsed)) {
      setPesoError('Peso inválido.');
      return;
    }
    setPesoError(null);

    const basePayload = {
      nome: nome.trim(),
      especie,
      raca: raca.trim() || null,
      dataNascimento: dataNascimento.trim() || null,
      pesoKg: pesoParsed,
      sexo,
      condicoesCronicas: condicoesCronicas.trim() || null,
      ativo: pet?.ativo ?? true,
    };

    if (mode === 'create') {
      criarPet.mutate(
        { ...basePayload, clinicaId: clinicaId as number },
        {
          onSuccess: (novoPet) => {
            setSelectedPetId(novoPet.id);
            onClose();
          },
          onError: (error) => {
            Alert.alert('Erro ao criar pet', error instanceof Error ? error.message : 'Tente novamente.');
          },
        }
      );
      return;
    }

    atualizarPet.mutate(
      { petId: pet!.id, payload: { ...basePayload, tutorId: pet!.tutor.id, clinicaId: pet!.clinica.id } },
      {
        onSuccess: () => onClose(),
        onError: (error) => {
          Alert.alert('Erro ao salvar pet', error instanceof Error ? error.message : 'Tente novamente.');
        },
      }
    );
  }

  function handleExcluir() {
    if (!pet) return;
    Alert.alert(
      'Excluir pet?',
      `Os dados de "${pet.nome}" serão apagados permanentemente. Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () =>
            excluirPet.mutate(pet.id, {
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
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{mode === 'create' ? 'Adicionar pet' : 'Editar pet'}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {semClinicaDisponivel ? (
            <Text style={styles.emptyText}>
              Não foi possível identificar a clínica responsável — cadastre pelo menos um pet pela clínica antes de
              adicionar outro por aqui.
            </Text>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <AppInput label="Nome do pet" placeholder="Ex: Rex" value={nome} onChangeText={setNome} icon="paw-outline" required />

              <View style={styles.fieldGroup}>
                <FieldLabel text="Espécie" required />
                <SegmentedControl segments={ESPECIE_SEGMENTS} value={especie} onChange={setEspecie} />
              </View>

              {especie === 'OUTRO' ? (
                <AppInput label="Raça" placeholder="Ex: Furão" value={raca} onChangeText={setRaca} icon="tag-outline" />
              ) : (
                <BreedPicker label="Raça" value={raca} onChange={setRaca} options={especie === 'GATO' ? catBreeds : dogBreeds} />
              )}

              <AppInput
                label="Data de nascimento"
                placeholder="AAAA-MM-DD"
                value={dataNascimento}
                onChangeText={(text) => {
                  setDataNascimento(text);
                  setDateError(null);
                }}
                keyboardType="numeric"
                icon="cake-variant-outline"
              />
              {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

              <AppInput
                label="Peso em kg"
                placeholder="Ex: 28.5"
                value={peso}
                onChangeText={(text) => {
                  setPeso(text);
                  setPesoError(null);
                }}
                keyboardType="decimal-pad"
                icon="weight-kilogram"
              />
              {pesoError ? <Text style={styles.errorText}>{pesoError}</Text> : null}

              <View style={styles.fieldGroup}>
                <FieldLabel text="Sexo" />
                <SegmentedControl segments={SEXO_SEGMENTS} value={sexo} onChange={setSexo} />
              </View>

              <AppInput
                label="Condições crônicas"
                placeholder="Ex: alergia, diabetes..."
                value={condicoesCronicas}
                onChangeText={setCondicoesCronicas}
                icon="note-text-outline"
              />

              <Button
                label="Salvar"
                onPress={handleSalvar}
                loading={mutation.isPending}
                style={styles.saveButton}
              />

              {mode === 'edit' ? (
                <Button
                  label="Excluir pet"
                  variant="danger"
                  onPress={handleExcluir}
                  loading={excluirPet.isPending}
                  style={styles.deleteButton}
                />
              ) : null}
            </ScrollView>
          )}
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
    maxHeight: '88%',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { ...typography.cardTitle, color: colors.textPrimary },
  fieldGroup: { marginBottom: spacing.md },
  errorText: { ...typography.caption, color: colors.danger, marginTop: -spacing.sm, marginBottom: spacing.md },
  saveButton: { marginTop: spacing.xs },
  deleteButton: { marginTop: spacing.md, marginBottom: spacing.sm },
  emptyText: { ...typography.body, color: colors.textSecondary, paddingVertical: spacing.lg },
});
