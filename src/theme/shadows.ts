import { Platform } from 'react-native';
import { colors } from './colors';

export const subtleCard = Platform.select({
  android: {
    elevation: 2,
  },
  default: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
});

export const borderOnly = {
  borderWidth: 1,
  borderColor: colors.borderGray,
} as const;
