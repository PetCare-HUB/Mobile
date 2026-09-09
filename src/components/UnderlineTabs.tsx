import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

type Tab<T extends string> = { key: T; label: string };

type UnderlineTabsProps<T extends string> = {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function UnderlineTabs<T extends string>({ tabs, value, onChange }: UnderlineTabsProps<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container} contentContainerStyle={styles.content}>
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <TouchableOpacity key={tab.key} onPress={() => onChange(tab.key)} style={styles.tab} activeOpacity={0.7}>
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            <View style={[styles.underline, active && styles.underlineActive]} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
    marginBottom: spacing.lg,
  },
  content: { gap: spacing.xl },
  tab: { paddingBottom: spacing.sm },
  label: { ...typography.subtitle, fontWeight: '400', color: colors.textSecondary },
  labelActive: { color: colors.greenPrimary, fontWeight: '600' },
  underline: { height: 2, marginTop: spacing.sm, backgroundColor: 'transparent' },
  underlineActive: { backgroundColor: colors.greenPrimary },
});
