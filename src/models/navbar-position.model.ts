export const NavbarPosition = {
  Top: 'top',
  Bottom: 'bottom',
  Floating: 'floating',
  Auto: 'auto',
} as const;

export type NavbarPositions = (typeof NavbarPosition)[keyof typeof NavbarPosition];
