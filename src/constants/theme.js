import { Platform } from 'react-native';

export const colors = {
  background: '#FCF4EF',
  card: '#FFFDF8',
  cardWarm: '#FFE9DA',
  primary: '#B45309',
  primaryDark: '#7C2D12',
  accent: '#F59E63',
  text: '#3B1F0B',
  muted: '#9A6745',
  mutedLight: '#B8947C',
  line: '#EED6C7',
  white: '#FFFFFF',
  blueButton: '#BFE5FF',
  success: '#4E9C54',
  danger: '#F36C4F',
  black: '#2E3132'
};

export const shadow = Platform.select({
  ios: {
    shadowColor: '#7C2D12',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 24
  },
  android: {
    elevation: 8
  },
  default: {}
});
