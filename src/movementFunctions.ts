import * as easings from './easings';
import {Coordinates} from './interfaces';

export type MovementFunction = ({targetCoordinates, initialCoordinates, progress}:
  {
    targetCoordinates: Coordinates,
    initialCoordinates: Coordinates,
    progress: number
  }
) => Coordinates;

export interface MovementFunctionConfig {
  name: string;
  displayName: string;
  function: MovementFunction;
  description?: string;
}

// Helper function for linear interpolation with easing
const createEasingMovementFunction = (easingFn: (t: number) => number): MovementFunction => {
  return ({targetCoordinates, initialCoordinates, progress}) => {
    const lerp = (start: number, end: number, t: number) => start + t * (end - start);

    const easedProgress = easingFn(progress);

    const x = lerp(initialCoordinates.x, targetCoordinates.x, easedProgress);
    const y = lerp(initialCoordinates.y, targetCoordinates.y, easedProgress);

    // Return final position if close to target
    if (Math.abs(x - targetCoordinates.x) < 1 &&
      Math.abs(y - targetCoordinates.y) < 1) {
      return {x: targetCoordinates.x, y: targetCoordinates.y};
    }

    return {x, y};
  };
};

// Movement function registry
export const movementFunctions: Record<string, MovementFunctionConfig> = {
  backInOut: {
    name: 'backInOut',
    displayName: 'Back In Out',
    function: createEasingMovementFunction(easings.backInOut),
    description: 'Back easing with overshoot'
  },

  // All easing functions
  linear: {
    name: 'linear',
    displayName: 'Linear',
    function: createEasingMovementFunction(easings.linear),
    description: 'Constant speed movement'
  },
  sineIn: {
    name: 'sineIn',
    displayName: 'Sine In',
    function: createEasingMovementFunction(easings.sineIn),
    description: 'Slow start, accelerating'
  },
  sineOut: {
    name: 'sineOut',
    displayName: 'Sine Out',
    function: createEasingMovementFunction(easings.sineOut),
    description: 'Fast start, decelerating'
  },
  sineInOut: {
    name: 'sineInOut',
    displayName: 'Sine In Out',
    function: createEasingMovementFunction(easings.sineInOut),
    description: 'Slow start and end'
  },
  quadIn: {
    name: 'quadIn',
    displayName: 'Quad In',
    function: createEasingMovementFunction(easings.quadIn),
    description: 'Quadratic acceleration'
  },
  quadOut: {
    name: 'quadOut',
    displayName: 'Quad Out',
    function: createEasingMovementFunction(easings.quadOut),
    description: 'Quadratic deceleration'
  },
  quadInOut: {
    name: 'quadInOut',
    displayName: 'Quad In Out',
    function: createEasingMovementFunction(easings.quadInOut),
    description: 'Quadratic acceleration and deceleration'
  },
  cubicIn: {
    name: 'cubicIn',
    displayName: 'Cubic In',
    function: createEasingMovementFunction(easings.cubicIn),
    description: 'Cubic acceleration'
  },
  cubicOut: {
    name: 'cubicOut',
    displayName: 'Cubic Out',
    function: createEasingMovementFunction(easings.cubicOut),
    description: 'Cubic deceleration'
  },
  cubicInOut: {
    name: 'cubicInOut',
    displayName: 'Cubic In Out',
    function: createEasingMovementFunction(easings.cubicInOut),
    description: 'Cubic acceleration and deceleration'
  },
  quartIn: {
    name: 'quartIn',
    displayName: 'Quart In',
    function: createEasingMovementFunction(easings.quartIn),
    description: 'Quartic acceleration'
  },
  quartOut: {
    name: 'quartOut',
    displayName: 'Quart Out',
    function: createEasingMovementFunction(easings.quartOut),
    description: 'Quartic deceleration'
  },
  quartInOut: {
    name: 'quartInOut',
    displayName: 'Quart In Out',
    function: createEasingMovementFunction(easings.quartInOut),
    description: 'Quartic acceleration and deceleration'
  },
  quintIn: {
    name: 'quintIn',
    displayName: 'Quint In',
    function: createEasingMovementFunction(easings.quintIn),
    description: 'Quintic acceleration'
  },
  quintOut: {
    name: 'quintOut',
    displayName: 'Quint Out',
    function: createEasingMovementFunction(easings.quintOut),
    description: 'Quintic deceleration'
  },
  quintInOut: {
    name: 'quintInOut',
    displayName: 'Quint In Out',
    function: createEasingMovementFunction(easings.quintInOut),
    description: 'Quintic acceleration and deceleration'
  },
  expoIn: {
    name: 'expoIn',
    displayName: 'Expo In',
    function: createEasingMovementFunction(easings.expoIn),
    description: 'Exponential acceleration'
  },
  expoOut: {
    name: 'expoOut',
    displayName: 'Expo Out',
    function: createEasingMovementFunction(easings.expoOut),
    description: 'Exponential deceleration'
  },
  expoInOut: {
    name: 'expoInOut',
    displayName: 'Expo In Out',
    function: createEasingMovementFunction(easings.expoInOut),
    description: 'Exponential acceleration and deceleration'
  },
  circIn: {
    name: 'circIn',
    displayName: 'Circ In',
    function: createEasingMovementFunction(easings.circIn),
    description: 'Circular acceleration'
  },
  circOut: {
    name: 'circOut',
    displayName: 'Circ Out',
    function: createEasingMovementFunction(easings.circOut),
    description: 'Circular deceleration'
  },
  circInOut: {
    name: 'circInOut',
    displayName: 'Circ In Out',
    function: createEasingMovementFunction(easings.circInOut),
    description: 'Circular acceleration and deceleration'
  },
  backIn: {
    name: 'backIn',
    displayName: 'Back In',
    function: createEasingMovementFunction(easings.backIn),
    description: 'Back with overshoot at start'
  },
  backOut: {
    name: 'backOut',
    displayName: 'Back Out',
    function: createEasingMovementFunction(easings.backOut),
    description: 'Back with overshoot at end'
  },
};

// Helper function to get available movement function names
export const getAvailableMovementFunctions = (): string[] => {
  return Object.keys(movementFunctions).filter(name => !name.includes('DEV'));
};

// Helper function to get a movement function by name
export const getMovementFunction = (name: string): MovementFunction | null => {
  return movementFunctions[name]?.function || null;
};
