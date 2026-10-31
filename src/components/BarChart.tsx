import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

type BarChartProps = {
  data: number[];
  labels?: string[];
  color?: string;
  barColors?: string[];
  legend?: { label: string; color: string }[];
  height?: number;
};

export function BarChart({ data, labels, color = colors.bluePrimary, barColors, legend, height = 96 }: BarChartProps) {
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
                  backgroundColor: barColors?.[index] ?? color,
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
            <Text key={index} style={[styles.label, label.includes('\n') && styles.rangeLabel]}>{label}</Text>
          ))}
        </View>
      ) : null}
      {legend ? (
        <View style={styles.legend}>
          {legend.map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
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
  labelsRow: { flexDirection: 'row', gap: 3, marginTop: spacing.xs },
  label: { ...typography.caption, color: colors.textSecondary, flex: 1, textAlign: 'center' },
  rangeLabel: { fontSize: 10, lineHeight: 12 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs / 2 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { ...typography.caption, color: colors.textSecondary },
});
