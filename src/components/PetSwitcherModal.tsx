import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';
import { ESPECIE_LABEL } from '../utils/petMappers';
import type { PetResponse } from '../types/api';
import { PetAvatar } from './PetAvatar';

type PetSwitcherModalProps = {
  visible: boolean;
  onClose: () => void;
  pets: PetResponse[];
  selectedPetId: number | null;
  onSelect: (petId: number) => void;
  onAddPet?: () => void;
};

export function PetSwitcherModal({ visible, onClose, pets, selectedPetId, onSelect, onAddPet }: PetSwitcherModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Seus pets</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={pets}
            keyExtractor={(pet) => String(pet.id)}
            style={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  onSelect(item.id);
                  onClose();
                }}
              >
                <PetAvatar name={item.nome} size={44} />
                <View style={styles.rowText}>
                  <Text style={styles.rowName}>{item.nome}</Text>
                  <Text style={styles.rowSubtitle}>{ESPECIE_LABEL[item.especie]} • {item.raca}</Text>
                </View>
                {item.id === selectedPetId ? (
                  <MaterialCommunityIcons name="check" size={18} color={colors.greenPrimary} />
                ) : null}
              </TouchableOpacity>
            )}
          />

          {onAddPet ? (
            <TouchableOpacity
              style={styles.addRow}
              onPress={() => {
                onClose();
                onAddPet();
              }}
              activeOpacity={0.8}
            >
              <View style={styles.addIcon}>
                <MaterialCommunityIcons name="plus" size={20} color={colors.greenPrimary} />
              </View>
              <Text style={styles.addLabel}>Adicionar novo pet</Text>
            </TouchableOpacity>
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
    maxHeight: '70%',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { ...typography.cardTitle, color: colors.textPrimary },
  list: { marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  rowText: { flex: 1, marginLeft: spacing.md },
  rowName: { ...typography.subtitle, color: colors.textPrimary },
  rowSubtitle: { ...typography.secondaryInfo, color: colors.textSecondary, marginTop: spacing.xs / 2 },
  addRow: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.md },
  addIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: { ...typography.subtitle, color: colors.greenPrimary, marginLeft: spacing.md },
});
