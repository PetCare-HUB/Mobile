import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
      iconName: 'alert-circle',
    };
  }

  if (severity === 'medium') {
    return {
      backgroundColor: '#FEF3C7',
      titleColor: '#92400E',
      iconName: 'alert',
    };
  }

  return {
    backgroundColor: '#DBEAFE',
    titleColor: '#1D4ED8',
    iconName: 'information',
  };
}

export function AlertCard({ title, message, severity }: AlertCardProps) {
  const alertStyle = getAlertStyle(severity);

  return (
    <View style={[styles.card, { backgroundColor: alertStyle.backgroundColor }]}>
      <View style={styles.titleContainer}>
        <MaterialCommunityIcons 
          name={alertStyle.iconName as any} 
          size={20} 
          color={alertStyle.titleColor} 
        />
        <Text style={[styles.title, { color: alertStyle.titleColor }]}>
          {title}
        </Text>
      </View>

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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
});
