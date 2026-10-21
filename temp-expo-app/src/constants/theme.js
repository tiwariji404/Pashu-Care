import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  primary: '#10B981',       // Emerald primary
  primaryDark: '#059669',   // Deep green
  primaryLight: '#D1FAE5',  // Mint accent
  primaryMuted: '#ECFDF5',  // Ultra light green background
  danger: '#EF4444',        // Emergency SOS Red
  dangerDark: '#DC2626',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',       // Amber warning
  warningLight: '#FEF3C7',
  info: '#3B82F6',          // Blue
  infoLight: '#DBEAFE',
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',
  
  light: {
    text: '#0F172A',
    background: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E2E8F0',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#E2E8F0',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
  },
  dark: {
    text: '#F8FAFC',
    background: '#090D16',
    card: '#131B2E',
    border: '#1E293B',
    backgroundElement: '#1E293B',
    backgroundSelected: '#334155',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
  full: 9999,
};

export const Shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  float: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  sos: {
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
};

export const BottomTabInset = Platform.select({ ios: 65, android: 75 }) ?? 70;
export const MaxContentWidth = 800;
