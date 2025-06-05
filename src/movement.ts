import {movementFunctions} from './movementFunctions';

export const getPredefinedMovementOptions: () => {
  [functionName: string]: {displayName: string; description?: string};
} = () => {
  return Object.fromEntries(
    Object.values(movementFunctions)
      .filter(config => !config.name.includes('DEV'))
      .map(config => [config.name, {
        displayName: config.displayName,
        description: config.description
      }])
  );
};
