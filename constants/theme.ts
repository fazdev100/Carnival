// Theme configuration for the app
export const colors = {
  // Base colors
  primary: '#E31837', // Carnival red
  background: '#121212', // Dark background
  card: '#1E1E1E', // Slightly lighter dark for cards
  border: '#2A2A2A', // Dark borders
  text: '#FFFFFF', // White text
  textSecondary: '#A0A0A0', // Secondary text
  accent: '#FF3B30', // High contrast accent
  
  // Interactive elements
  interactive: {
    primary: '#FF3B30',
    secondary: '#FFFFFF',
    disabled: '#666666',
    background: 'rgba(255, 255, 255, 0.08)',
    backgroundActive: 'rgba(255, 255, 255, 0.12)',
  },
  
  // Brand colors with improved contrast
  brands: {
    PEOPLE: '#FF3B30',
    'ENTERTAINMENT WEEKLY': '#4299E1',
    INSTYLE: '#9F7AEA',
    BRIDES: '#48BB78',
  },
  
  // Icon colors with improved visibility
  icon: {
    primary: '#FFFFFF',
    secondary: '#A0A0A0',
    active: '#FF3B30',
    inactive: '#666666',
  },
  
  // Overlay and backdrop colors
  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.5)',
  },
} as const;

export const typography = {
  // Font sizes with improved readability
  sizes: {
    logo: 32,
    title: {
      large: 32,
      medium: 24,
      small: 20,
    },
    body: {
      large: 18,
      medium: 16,
      small: 14,
    },
    caption: 12,
  },
  
  // Font weights
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    uppercase: 1,
  },
} as const;

// Touch target sizes for mobile
export const touchTargets = {
  minimum: 44, // Minimum touch target size in pixels
  icon: {
    small: 24,
    medium: 28,
    large: 32,
  },
  spacing: {
    small: 8,
    medium: 12,
    large: 16,
  },
} as const;

// Shadow styles with improved visibility on dark theme
export const shadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 7,
  },
} as const;