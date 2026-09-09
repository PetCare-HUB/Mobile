import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

type BarChartProps = {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
};

export function BarChart({ data, labels, color = colors.bluePrimary, height = 96 }: BarChartProps) {
  const max = Math.max(...data, 1);

  return (
    <View>
      <View style={[styles.bars, { height }]}>
        {data.map((value, index) => (
          <View key={index} style={styles.barTrack}>
            <View
              style={[
                styles.bar,
                {
                  height: Math.max((value / max) * height, 4),
                  backgroundColor: color,
                  opacity: 0.5 + (value / max) * 0.5,
                },
              ]}
            />
          </View>
        ))}
      </View>
      {labels ? (
        <View style={styles.labelsRow}>
          {labels.map((label, index) => (
            <Text key={index} style={styles.label}>{label}</Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  barTrack: { flex: 1, justifyContent: 'flex-end' },
  bar: { borderRadius: 3, width: '100%' },
  labelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  label: { ...typography.caption, color: colors.textSecondary },
});
