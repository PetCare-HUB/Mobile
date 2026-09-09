import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, shadows, typography } from '../theme';

type DeviceCardProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  connected: boolean;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightValue?: string;
};

export function DeviceCard({ icon, title, connected, rightIcon, rightValue }: DeviceCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBadge}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.textPrimary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.status, { color: connected ? colors.success : colors.textSecondary }]}>
          {connected ? 'Conectada' : 'Desconectada'}
        </Text>
      </View>
      {rightValue ? (
        <View style={styles.rightValueRow}>
          {rightIcon ? <MaterialCommunityIcons name={rightIcon} size={18} color={colors.success} /> : null}
          <Text style={styles.rightValue}>{rightValue}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.cardMd,
    padding: spacing.cardPadding,
    marginBottom: spacing.cardGap,
    ...shadows.subtleCard,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: radius.cardSm,
    backgroundColor: colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: { flex: 1 },
  title: { ...typography.cardTitle, color: colors.textPrimary },
  status: { ...typography.body, fontWeight: '600', marginTop: spacing.xs / 2 },
  rightValueRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  rightValue: { ...typography.subtitle, color: colors.textPrimary },
});
