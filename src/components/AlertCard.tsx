import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

type AlertCardProps = {
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
};

function getAlertStyle(severity: AlertCardProps['severity']) {
  if (severity === 'high') {
    return { backgroundColor: '#FBE7E7', titleColor: colors.danger, iconName: 'alert-circle' as const };
  }

  if (severity === 'medium') {
    return { backgroundColor: '#FDF1DF', titleColor: colors.warning, iconName: 'alert' as const };
  }

  return { backgroundColor: colors.blueLight, titleColor: colors.bluePrimary, iconName: 'information' as const };
}

export function AlertCard({ title, message, severity }: AlertCardProps) {
  const alertStyle = getAlertStyle(severity);

  return (
    <View style={[styles.card, { backgroundColor: alertStyle.backgroundColor }]}>
      <View style={styles.titleContainer}>
        <MaterialCommunityIcons name={alertStyle.iconName} size={20} color={alertStyle.titleColor} />
        <Text style={[styles.title, { color: alertStyle.titleColor }]}>{title}</Text>
      </View>

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.cardPadding,
    borderRadius: radius.cardMd,
    marginBottom: spacing.cardGap,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm - 2,
    marginBottom: spacing.xs + 2,
  },
  title: { ...typography.cardTitle },
  message: { ...typography.body, color: colors.textPrimary },
});
