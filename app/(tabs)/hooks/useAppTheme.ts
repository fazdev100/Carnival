import { colors, shadows, touchTargets, typography } from '../constants/theme';

export function useAppTheme() {
  return {
    isDark: true, // Force dark theme
    colors,
    typography,
    shadows,
    touchTargets,
  };
}