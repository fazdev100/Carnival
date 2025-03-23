import { Text, TextStyle, StyleSheet } from 'react-native';
import { colors, typography } from '../constants/theme';

interface TypographyProps {
  variant?: 'logo' | 'title' | 'body' | 'caption';
  size?: 'small' | 'medium' | 'large';
  weight?: keyof typeof typography.weights;
  color?: string;
  style?: TextStyle;
  children: React.ReactNode;
}

export function Typography({
  variant = 'body',
  size = 'medium',
  weight = 'regular',
  color,
  style,
  children,
}: TypographyProps) {
  const getStyles = () => {
    const baseStyle: TextStyle = {
      fontWeight: typography.weights[weight],
    };

    switch (variant) {
      case 'logo':
        return {
          ...baseStyle,
          fontSize: typography.sizes.logo,
          letterSpacing: typography.letterSpacing.wide,
          fontWeight: typography.weights.bold,
        };
      case 'title':
        return {
          ...baseStyle,
          fontSize: typography.sizes.title[size],
          letterSpacing: typography.letterSpacing.tight,
          lineHeight: typography.lineHeights.tight,
        };
      case 'caption':
        return {
          ...baseStyle,
          fontSize: typography.sizes.caption,
          letterSpacing: typography.letterSpacing.normal,
        };
      default:
        return {
          ...baseStyle,
          fontSize: typography.sizes.body[size],
          letterSpacing: typography.letterSpacing.normal,
          lineHeight: typography.lineHeights.normal,
        };
    }
  };

  return (
    <Text style={[getStyles(), { color }, style]}>
      {children}
    </Text>
  );
}