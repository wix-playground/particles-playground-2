/**
 * Linear easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const linear = (t: number) => t;

/**
 * Sine-in easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const sineIn = (t: number) => 1 - Math.cos((t * Math.PI) / 2);

/**
 * Sine-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const sineOut = (t: number) => Math.sin((t * Math.PI) / 2);

/**
 * Sine-in-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const sineInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Quadratic-in easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const quadIn = (t: number) => t ** 2;

/**
 * Quadratic-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const quadOut = (t: number) => 1 - (1 - t) ** 2;

/**
 * Quadratic-in-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const quadInOut = (t: number) =>
  t < 0.5 ? 2 * t ** 2 : 1 - (-2 * t + 2) ** 2 / 2;

/**
 * Cubic-in easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const cubicIn = (t: number) => t ** 3;

/**
 * Cubic-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const cubicOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Cubic-in-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const cubicInOut = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

/**
 * Quartic-in easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const quartIn = (t: number) => t ** 4;

/**
 * Quartic-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const quartOut = (t: number) => 1 - (1 - t) ** 4;

/**
 * Quartic-in-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const quartInOut = (t: number) =>
  t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;

/**
 * Quintic-in easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const quintIn = (t: number) => t ** 5;

/**
 * Quintic-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const quintOut = (t: number) => 1 - (1 - t) ** 5;

/**
 * Quintic-in-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const quintInOut = (t: number) =>
  t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2;

/**
 * Exponential-in easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const expoIn = (t: number) => (t === 0 ? 0 : 2 ** (10 * t - 10));

/**
 * Exponential-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const expoOut = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * Exponential-in-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const expoInOut = (t: number) =>
  t === 0
    ? 0
    : t === 1
      ? 1
      : t < 0.5
        ? 2 ** (20 * t - 10) / 2
        : (2 - 2 ** (-20 * t + 10)) / 2;

/**
 * Circular-in easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const circIn = (t: number) => 1 - Math.sqrt(1 - t ** 2);

/**
 * Circular-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const circOut = (t: number) => Math.sqrt(1 - (t - 1) ** 2);

/**
 * Circular-in-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const circInOut = (t: number) =>
  t < 0.5
    ? (1 - Math.sqrt(1 - 4 * t ** 2)) / 2
    : (Math.sqrt(-(2 * t - 3) * (2 * t - 1)) + 1) / 2;

/**
 * Back-in easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const backIn = (t: number) => 2.70158 * t ** 3 - 1.70158 * t ** 2;

/**
 * Back-out easing function.
 * @param t - The time value (between 0 and 1).
 * @returns The eased value.
 */
export const backOut = (t: number) =>
  1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;

/**
 * Back-in-out easing function.
 * @param t - The time value (between 0 and 1).
 * @param k - The back factor (optional, default is 1.70158 * 1.525).
 * @returns The eased value.
 */
export const backInOut = (t: number, k = 1.70158 * 1.525) =>
  t < 0.5
    ? ((2 * t) ** 2 * ((k + 1) * 2 * t - k)) / 2
    : ((2 * t - 2) ** 2 * ((k + 1) * (t * 2 - 2) + k) + 2) / 2;

