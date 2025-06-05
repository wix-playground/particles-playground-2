export interface SettingConfig {
  min: number;
  max: number;
  step?: number;
}

export const getSettingsConfig = (): Record<string, SettingConfig> => ({
  // Particle settings
  particleSpread: {
    min: 1,
    max: 5,
    step: 0.5,
  },
  turbulence: {
    min: 0,
    max: 4,
    step: 0.1,
  },
  windSpeed: {
    min: 0.1,
    max: 3,
    step: 0.1,
  },
  windDirection: {
    min: 0,
    max: 360,
    step: 1,
  },
  revealDirection: {
    min: 0,
    max: 360,
    step: 1,
  },
  startParticleSize: {
    min: 0.5,
    max: 10,
    step: 0.5,
  },
  endParticleSize: {
    min: 0.5,
    max: 10,
    step: 0.5,
  },
  startParticleOpacity: {
    min: 0,
    max: 1,
    step: 0.01,
  },
  endParticleOpacity: {
    min: 0,
    max: 1,
    step: 0.01,
  },
  particleRadius: {
    min: 1,
    max: 10,
    step: 1,
  },

  // Animation settings
  animationDuration: {
    min: 500,
    max: 5000,
    step: 100,
  },
  delay: {
    min: 0,
    max: 4900, // MAX_ANIMATION_DURATION - 100
    step: 100,
  },

  // Font settings
  fontSize: {
    min: 8,
    max: 140,
    step: 1,
  },

  // Emitter settings
  emitterX: {
    min: 0,
    max: 1000,
    step: 1,
  },
  emitterY: {
    min: 0,
    max: 600,
    step: 1,
  },
  emitterSize: {
    min: 1,
    max: 300,
    step: 1,
  },
  emitterAngle: {
    min: -360,
    max: 360,
    step: 1,
  },
  maxEffectParticleLifetime: {
    min: 500,
    max: 3000,
    step: 100,
  },
});

export const getRandomValueForSetting = (settingName: string, override?: {max?: number; min?: number; step?: number}): number => {
  const config = getSettingsConfig()[settingName];
  if (!config) {
    throw new Error(`Setting '${settingName}' not found in settings config`);
  }

  const {min, max, step = 1} = {...config, ...override};

  // Generate random value within range, respecting step
  const range = max - min
  const steps = Math.floor(range / step);
  const randomStep = Math.floor(Math.random() * (steps + 1));

  return min + (randomStep * step);
};
