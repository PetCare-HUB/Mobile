import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';
import type { PetResponse } from '../types/api';
import { PetAvatar } from './PetAvatar';

const ESPECIE_LABEL: Record<PetResponse['especie'], string> = {
  CAO: 'Cachorro',
  GATO: 'Gato',
  OUTRO: 'Outro',
};

type PetSwitcherModalProps = {
  visible: boolean;
  onClose: () => void;
  pets: PetResponse[];
  selectedPetId: number | null;
  onSelect: (petId: number) => void;
};

export function PetSwitcherModal({ visible, onClose, pets, selectedPetId, onSelect }: PetSwitcherModalProps) {
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
});
