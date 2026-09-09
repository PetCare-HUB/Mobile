import { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';
import { FieldLabel } from './FieldLabel';

type BreedPickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
};

export function BreedPicker({ label, value, onChange, options, required }: BreedPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter((option) => option.toLowerCase().includes(search.toLowerCase()));

  function handleSelect(option: string) {
    onChange(option);
    setOpen(false);
    setSearch('');
  }

  return (
    <View style={styles.container}>
      <FieldLabel text={label} required={required} />
      <TouchableOpacity style={styles.inputRow} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <MaterialCommunityIcons name="tag-outline" size={18} color={colors.textSecondary} style={styles.icon} />
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
          {value || 'Selecione a raça'}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Selecione a raça</Text>
              <TouchableOpacity onPress={() => setOpen(false)} hitSlop={8}>
                <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchRow}>
              <MaterialCommunityIcons name="magnify" size={18} color={colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar raça..."
                placeholderTextColor={colors.textSecondary}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                  {item === value ? <MaterialCommunityIcons name="check" size={18} color={colors.greenPrimary} /> : null}
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma raça encontrada.</Text>}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: spacing.inputHeight,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.borderGray,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  icon: { marginRight: -spacing.xs },
  value: { flex: 1, ...typography.body, color: colors.textPrimary },
  placeholder: { color: colors.textSecondary },
  overlay: { flex: 1, backgroundColor: 'rgba(21, 52, 73, 0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.cardLg,
    borderTopRightRadius: radius.cardLg,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '75%',
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sheetTitle: { ...typography.cardTitle, color: colors.textPrimary },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: spacing.inputHeight,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.borderGray,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: { flex: 1, ...typography.body, color: colors.textPrimary, paddingVertical: 0 },
  list: { marginBottom: spacing.sm },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  optionText: { ...typography.body, color: colors.textPrimary },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', paddingVertical: spacing.lg },
});
