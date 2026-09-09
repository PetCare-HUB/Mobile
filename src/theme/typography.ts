import type { TextStyle } from 'react-native';

type NamedTextStyle = Pick<TextStyle, 'fontSize' | 'fontWeight' | 'lineHeight'>;

export const typography: Record<
  'hero' | 'pageTitle' | 'cardTitle' | 'subtitle' | 'body' | 'secondaryInfo' | 'caption' | 'bottomNav',
  NamedTextStyle
> = {
  hero: { fontSize: 32, fontWeight: '700', lineHeight: 38 },
  pageTitle: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
  cardTitle: { fontSize: 17, fontWeight: '600', lineHeight: 22 },
  subtitle: { fontSize: 15, fontWeight: '600', lineHeight: 21 },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  secondaryInfo: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  bottomNav: { fontSize: 11, fontWeight: '500', lineHeight: 14 },
};
