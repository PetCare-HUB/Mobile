import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, type KeyboardTypeOptions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

type AppInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  icon,
}: AppInputProps) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        {icon ? <MaterialCommunityIcons name={icon} size={18} color={colors.textSecondary} style={styles.icon} /> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType}
          secureTextEntry={hidden}
        />
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setHidden((v) => !v)} hitSlop={8}>
            <MaterialCommunityIcons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { ...typography.secondaryInfo, color: colors.textSecondary, marginBottom: spacing.xs },
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
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
});
