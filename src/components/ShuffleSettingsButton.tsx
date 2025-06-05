import {useCallback} from "react";
import {useWorkerActions} from "../hooks/useWorkerActions";
import {ParticleSizeEasingType, ParticleOpacityEasingType, FontFamily, fontFamilies, StartPositionType} from "../interfaces";
import {getPredefinedMovementOptions} from "../movement";
import {getRandomValueForSetting} from "../settings-config";


// Helper function to get random element from array
const getRandomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to generate random colors
const generateRandomColors = (): string[] => {
  const colorCount = Math.floor(Math.random() * 5) + 1; // 1-5 colors
  const colors: string[] = [];

  for (let i = 0; i < colorCount; i++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 51) + 50; // 50-100%
    const lightness = Math.floor(Math.random() * 41) + 40; // 40-80%
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
};

// Predefined fun text options
const textOptions = [
  'WIX 🤠\nParticles!',
  'Hello\nWorld!',
  'AMAZING\nEFFECTS',
  'COOL\nANIMATION',
  '🎉 PARTY 🎉',
  'MAGIC ✨',
  'EPIC\nMOTION',
  'AWESOME\nDESIGN',
  '🚀 LAUNCH 🚀',
  'FANTASTIC',
  'BOOM!\n💥',
  'CELEBRATE',
  'INCREDIBLE',
  'STUNNING',
  'BRILLIANT',
];

// Available start positions
const startPositions: StartPositionType[] = [
  'random',
  'canvasEdges',
  'center',
  'topLeft',
  'emitterPoint',
  'emitterCircle',
  'emitterSquare',
  'emitterHLine',
  'emitterVLine',
  'enterTopTextWidth',
  'enterBottomTextWidth',
  'enterLeftTextHeight',
  'enterRightTextHeight',
  'top-left',
  'top-right',
  'top',
  'bottom-left',
  'bottom-right',
  'bottom',
  'left',
  'right'
];

export const ShuffleSettingsButton = () => {
  // Available easing types
  const sizeEasingTypes: ParticleSizeEasingType[] = ['bell', 'linear', 'multiPulse'];
  const opacityEasingTypes: ParticleOpacityEasingType[] = ['bell', 'linear', 'multiPulse'];
  const workerActions = useWorkerActions();


  const shuffleSettings = useCallback(() => {
    if (!workerActions) return;

    // Get available movement functions
    const movementOptions = getPredefinedMovementOptions();
    const movementKeys = Object.keys(movementOptions);

    // Randomize all settings
    const randomMovementKey = getRandomElement(movementKeys);
    const randomFont: FontFamily = getRandomElement([...fontFamilies]);
    const randomText = getRandomElement(textOptions);
    const randomColors = generateRandomColors();
    const randomStartPosition = getRandomElement(startPositions);

    // Font weight ranges for different fonts
    const getFontWeightRange = (fontFamily: FontFamily): number[] => {
      const ranges: Record<FontFamily, number[]> = {
        'Arial': [200, 300, 400, 500, 600, 700, 800],
        'Pirata One': [400],
        'Poppins': [100, 200, 300, 400, 500, 600, 700, 800, 900],
        'Press Start 2P': [400],
        'Modak': [400],
        'UnifrakturMaguntia': [400],
        'Junge': [400],
        'Ojuju': [200, 300, 400, 500, 600, 700, 800],
        'Syne': [400, 500, 600, 700, 800],
        'Sora': [100, 200, 300, 400, 500, 600, 700, 800],
        'K2D': [100, 200, 300, 400, 500, 600, 700, 800],
        'Playfair': [300, 400, 500, 600, 700, 800, 900],
        'Luxurious Script': [400],
        'Fraunces': [100, 200, 300, 400, 500, 600, 700, 800, 900],
        'Belinda': [400],
        'DIN': [400],
      };
      return ranges[fontFamily] || [400];
    };

    const revealAnimation = Math.random() > 0.8;
    const randomWeight = getRandomElement(getFontWeightRange(randomFont));
    const randomAnimationDuration = getRandomValueForSetting('animationDuration', revealAnimation ? {max: 3000} : undefined)
    const randomDelay = revealAnimation ? 0 : getRandomValueForSetting('delay', {max: randomAnimationDuration})
    const randomFontSize = getRandomValueForSetting('fontSize', {min: 64, max: 64})
    const randomParticleRadius = revealAnimation ? 1 : getRandomValueForSetting('particleRadius')

    // Apply all randomized settings in one call using centralized config
    workerActions.updateAppProps({
      text: randomText,
      particleColors: randomColors,
      selectedMovementFunction: randomMovementKey,
      startPosition: randomStartPosition,
      font: {
        fontFamily: randomFont,
        fontSize: randomFontSize,
        italic: Math.random() > 0.7, // 30% chance for italic
        weight: randomWeight,
      },
      particleRadius: randomParticleRadius,
      particleSpread: 3,
      startParticleOpacity: getRandomValueForSetting('startParticleOpacity'),
      endParticleOpacity: getRandomValueForSetting('endParticleOpacity'),
      startParticleSize: getRandomValueForSetting('startParticleSize'),
      endParticleSize: getRandomValueForSetting('endParticleSize'),
      particleSizeEasing: getRandomElement(sizeEasingTypes),
      particleOpacityEasing: getRandomElement(opacityEasingTypes),
      animationDuration: randomAnimationDuration,
      delay: randomDelay,
      emitterX: getRandomValueForSetting('emitterX'),
      emitterY: getRandomValueForSetting('emitterY'),
      emitterSize: getRandomValueForSetting('emitterSize'),
      emitterAngle: getRandomValueForSetting('emitterAngle'),
      revealDirection: getRandomValueForSetting('revealDirection'),
      enableRevealAnimation: revealAnimation,
      turbulence: getRandomValueForSetting('turbulence'),
      windSpeed: getRandomValueForSetting('windSpeed'),
      windDirection: getRandomValueForSetting('windDirection'),
      maxEffectParticleLifetime: getRandomValueForSetting('maxEffectParticleLifetime'),
    });
  }, [workerActions]);

  return <button onClick={shuffleSettings} className="shuffle-button" style={{flex: '1 1 0'}}>Shuffle Settings</button>
};
