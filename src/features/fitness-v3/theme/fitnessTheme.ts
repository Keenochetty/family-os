export const fitnessTheme = {
  dark: {
    page: '#070B0F',
    surface1: '#10161A',
    surface2: '#151D21',
    surface3: '#1C262B',
    line: '#29343A',
    text: '#F5F3EF',
    muted: '#919A9E',
    subtle: '#667176',
    accent: '#E45E32',
    accentPressed: '#C94B27',
    accentSoft: '#2B1710',
    teal: '#20A595',
    green: '#41AE76',
    gold: '#D99B31',
    warning: '#D7812F',
    danger: '#D85650',
    purple: '#9887C9',
    track: '#344047',
  },
  light: {
    page: '#F3EEE8',
    surface1: '#FFFCF8',
    surface2: '#F6F0EA',
    surface3: '#ECE4DC',
    line: '#D9CFC6',
    text: '#17191A',
    muted: '#656B6D',
    subtle: '#92989A',
    accent: '#D95731',
    accentPressed: '#B94727',
    accentSoft: '#F6DCCE',
    teal: '#138D82',
    green: '#2F8C60',
    gold: '#A9731D',
    warning: '#A9671F',
    danger: '#B64B47',
    purple: '#6F62A4',
    track: '#DDD3CA',
  },
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  hero: 24,
  sheet: 30,
  pill: 999,
} as const;

export type FitnessThemeMode = keyof typeof fitnessTheme;

export const getFitnessTheme = (mode: FitnessThemeMode) => fitnessTheme[mode];
