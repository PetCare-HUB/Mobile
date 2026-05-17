import { StyleSheet, Text, View } from 'react-native';

type AlertCardProps = {
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
};

function getAlertStyle(severity: AlertCardProps['severity']) {
  if (severity === 'high') {
    return {
      backgroundColor: '#FEE2E2',
      titleColor: '#991B1B',
      icon: '🚨',
    };
  }

  if (severity === 'medium') {
    return {
      backgroundColor: '#FEF3C7',
      titleColor: '#92400E',
      icon: '⚠️',
    };
  }

  return {
    backgroundColor: '#DBEAFE',
    titleColor: '#1D4ED8',
    icon: 'ℹ️',
  };
}

export function AlertCard({ title, message, severity }: AlertCardProps) {
  const alertStyle = getAlertStyle(severity);

  return (
    <View style={[styles.card, { backgroundColor: alertStyle.backgroundColor }]}>
      <Text style={[styles.title, { color: alertStyle.titleColor }]}>
        {alertStyle.icon} {title}
      </Text>

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
});