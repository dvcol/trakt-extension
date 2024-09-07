export const SwipeDirection = {
  Up: 'up',
  Down: 'down',
  Left: 'left',
  Right: 'right',
} as const;

export type SwipeDirections = (typeof SwipeDirection)[keyof typeof SwipeDirection];

export type SwipeTolerances = {
  horizontal?: number;
  up?: number;
  down?: number;
  vertical?: number;
  left?: number;
  right?: number;
};

/**
 * Detects swipe up or down from touch events
 * @param start - The TouchStart event
 * @param end - The TouchEnd event
 * @param tolerance - The vertical tolerance for swipe detection
 * @param tolerance.up - The vertical tolerance for swipe up detection
 * @param tolerance.down - The vertical tolerance for swipe down detection
 * @param tolerance.horizontal - The vertical horizontal for swipe detection
 */
export const handleSwipeUpDown = (
  start?: Touch,
  end?: Touch,
  { horizontal = 0, up = 0, down = 0 }: Pick<SwipeTolerances, 'horizontal' | 'up' | 'down'> = {},
): SwipeDirections | undefined => {
  if (!start || !end) return;
  // If it is a swipe left/right above the tolerance exit
  if (horizontal && Math.abs(start.clientX - end.clientX) >= horizontal) return;
  // If it is a tap or swipe down, make hover true
  if (start.clientY - end.clientY < down) return SwipeDirection.Down;

  // If it is a swipe up with some left/right tolerance, make hover false
  if (start.clientY - end.clientY > up) return SwipeDirection.Up;
};

/**
 * Detects swipe left or right from touch events
 * @param start - The TouchStart event
 * @param end - The TouchEnd event
 * @param tolerance - The horizontal tolerance for swipe detection
 * @param tolerance.left - The horizontal tolerance for swipe left detection
 * @param tolerance.right - The horizontal tolerance for swipe right detection
 * @param tolerance.vertical - The vertical tolerance for swipe detection
 */
export const handleSwipeLeftRight = (
  start?: Touch,
  end?: Touch,
  { vertical = 0, left = 50, right = 50 }: Pick<SwipeTolerances, 'vertical' | 'left' | 'right'> = {},
): SwipeDirections | undefined => {
  if (!start || !end) return;
  // If it is a tap or swipe up/down above the tolerance exit
  if (vertical && Math.abs(start.clientY - end.clientY) >= vertical) return;

  // if swipe right
  if (end.clientX - start.clientX > right) return SwipeDirection.Right;
  // if swipe left
  if (start.clientX - end.clientX > left) return SwipeDirection.Left;
};

/**
 * Detects swipe direction from touch events
 * @param start - The TouchStart event
 * @param end - The TouchEnd event
 * @param tolerances - The tolerances for swipe detection
 */
export const handleSwipe = (start?: Touch, end?: Touch, tolerances: SwipeTolerances = {}): SwipeDirections | undefined => {
  return handleSwipeLeftRight(start, end, tolerances) ?? handleSwipeUpDown(start, end, tolerances);
};
