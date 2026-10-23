export interface StackRowConfig {
  label: string;
  items: string[];
  copies: number;
  duration: number;
  reverse?: boolean;
}

export type StackRow = StackRowConfig;

export const STACK_ROWS: StackRowConfig[] = [
  {
    label: 'Frontend & Mobile',
    items: [
      'React Native',
      'Expo',
      'React.js',
      'TypeScript',
      'JavaScript',
      'Expo Router',
      'React Navigation',
      'Reanimated',
      'Gesture Handler',
      'Tailwind CSS',
      'HTML',
      'CSS',
    ],
    copies: 2,
    duration: 54,
  },
  {
    label: 'Backend, Data & AI',
    items: [
      'Python',
      'AI Building',
      'AI Automation',
      'AI Tools',
      'Firebase',
      'Firestore',
      'Supabase',
      'PostgreSQL',
      'Node.js',
      'Express.js',
      'Django',
      'REST APIs',
    ],
    copies: 2,
    duration: 46,
    reverse: true,
  },
  {
    label: 'App Services & Dev',
    items: [
      'Google Sign-In / OAuth',
      'Push Notifications',
      'RevenueCat',
      'react-native-iap',
      'AsyncStorage',
      'expo-local-authentication',
      'EAS Build',
      'Play Console',
      'Playwright',
      'GitHub Actions',
      'CI/CD',
      'Git',
      'GitHub',
      'Docker',
      'Postman',
      'VS Code',
    ],
    copies: 2,
    duration: 60,
  },
  {
    label: 'Creative & Research',
    items: [
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Graphic Design',
      'Brand Identity',
      'UI Design',
      'Visual Design',
      'Presentation Design',
      'Medical Research',
      'Video Editing',
      'Creative Automation',
      'Digital Content Creation',
    ],
    copies: 2,
    duration: 48,
    reverse: true,
  },
];
