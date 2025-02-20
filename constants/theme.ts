// Theme configuration for the app
export const colors = {
  // Base colors
  primary: '#E31837', // Carnival red
  background: '#000000', // Pure black background
  text: '#FFFFFF', // White text
  secondary: '#888888', // Secondary text
  accent: '#FF3B30', // High contrast accent
  
  // Brand colors
  brands: {
    PEOPLE: '#E31837',
    'ENTERTAINMENT WEEKLY': '#2C5282',
    INSTYLE: '#805AD5',
    BRIDES: '#38A169',
  },
  
  // UI Elements
  card: '#1A1A1A', // Dark gray for cards
  border: '#333333', // Border color
  button: {
    active: '#FF3B30',
    inactive: '#333333',
  },
  icon: '#FFFFFF', // White icons
} as const;

export const typography = {
  // Font sizes
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