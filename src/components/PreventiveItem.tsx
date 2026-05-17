import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PreventiveItemProps = {
  title: string;
  date: string;
  description: string;
  done: boolean;
  onToggle?: () => void;
};

export function PreventiveItem({
  title,
  date,
  description,
  done,
  onToggle,
}: PreventiveItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <Text style={[styles.status, done ? styles.done : styles.pending]}>
          {done ? 'Feito' : 'Pendente'}
        </Text>
      </View>

      <Text style={styles.date}>{date}</Text>
      <Text style={styles.description}>{description}</Text>

      {onToggle && (
        <TouchableOpacity
          style={[styles.button, done ? styles.undoButton : styles.doneButton]}
          onPress={onToggle}
        >
          <Text style={styles.buttonText}>
            {done ? 'Marcar como pendente' : 'Marcar como feito'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    overflow: 'hidden',
  },
  done: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  pending: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  date: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  button: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
  },
  doneButton: {
    backgroundColor: '#16A34A',
  },
  undoButton: {
    backgroundColor: '#64748B',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});