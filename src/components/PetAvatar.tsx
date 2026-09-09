import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

type PetAvatarProps = {
  name: string;
  size?: number;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}

export function PetAvatar({ name, size = 52 }: PetAvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: radius.pill }]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.greenPrimary,
    fontWeight: '700',
  },
});
