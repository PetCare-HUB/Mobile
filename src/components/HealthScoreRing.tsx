import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { HealthStatus } from '../types/pet';
import { colors, healthStatusColor, typography } from '../theme';

type HealthScoreRingProps = {
  score: number;
  status: HealthStatus;
  size?: number;
  strokeWidth?: number;
};

export function HealthScoreRing({ score, status, size = 116, strokeWidth = 10 }: HealthScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (1 - clamped / 100);
  const color = healthStatusColor[status];

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.backgroundGray}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          fill="none"
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View style={[styles.center, { width: size, height: size }]}>
        <Text style={[styles.score, { color }]}>{clamped}</Text>
        <Text style={styles.max}>/100</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: { ...typography.hero },
  max: { ...typography.caption, color: colors.textSecondary, marginTop: -2 },
});
