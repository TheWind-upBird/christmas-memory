// 使用常量对象代替 enum，解决 TypeScript 报错
export const AppState = {
  TREE: 'TREE',
  EXPLODE: 'EXPLODE',
} as const;
export type AppState = typeof AppState[keyof typeof AppState];

export const ColorTheme = {
  PINK: 'PINK',
  GOLD: 'GOLD',
  BLUE: 'BLUE',
  PURPLE: 'PURPLE',
} as const;
export type ColorTheme = typeof ColorTheme[keyof typeof ColorTheme];