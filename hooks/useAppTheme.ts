import { colors } from '../constants/theme';

export function useAppTheme() {
  // Force dark theme
  return {
    isDark: true,
    colors: {
      background: colors.background,
      text: colors.text,
      secondary: colors.secondary,
      card: colors.card,
      border: colors.border,
      icon: colors.icon,
      ...colors,
    },
  };
}