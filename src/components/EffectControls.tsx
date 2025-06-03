import {useCallback} from 'react';
import {TextInput} from './Settings/TextSettings/TextInput';
import {FontSettings} from './Settings/TextSettings/FontSettings';
import {MultiColorPicker} from './Settings/MultiColorPicker';
import {ParticleDensity} from './Settings/ParticleDensity';
import {ParticleSpread} from './Settings/ParticleSpread';
import {ParticleOpacity} from './Settings/ParticleOpacity';
import {ParticleSize} from './Settings/ParticleSize';
import {AnimationDuration} from './Settings/AnimationDuration';
import {ShareButton} from './ShareButton';
import {ParticleDelay} from './Settings/ParticleDelay';
import {ParticleOrigin} from './Settings/ParticleOrigin';
import {useWorkerActions} from '../hooks/useWorkerActions';
import {getPredefinedMovementOptions} from '../movement';
import {fontFamilies, FontFamily, StartPositionType, ParticleSizeEasingType, ParticleOpacityEasingType} from '../interfaces';
import {getRandomValueForSetting} from '../settings-config';

interface EffectControlsProps {
  onPlay: () => void;
}

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

// Available easing types
const sizeEasingTypes: ParticleSizeEasingType[] = ['bell', 'linear', 'multiPulse'];
const opacityEasingTypes: ParticleOpacityEasingType[] = ['bell', 'linear', 'multiPulse'];

export const EffectControls = ({onPlay}: EffectControlsProps) => {
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

    const randomWeight = getRandomElement(getFontWeightRange(randomFont));
    const randomAnimationDuration = getRandomValueForSetting('animationDuration')
    const randomDelay = getRandomValueForSetting('delay', {max: randomAnimationDuration})
    const randomFontSize = getRandomValueForSetting('fontSize', {min: 64, max: 64})

    // Apply all randomized settings in one call using centralized config
    workerActions.updateAppProps({
      text: randomText,
      particleColors: randomColors,
      selectedMovementFunction: randomMovementKey,
      movementFunctionCode: movementOptions[randomMovementKey].code,
      startPosition: randomStartPosition,
      font: {
        fontFamily: randomFont,
        fontSize: randomFontSize,
        italic: Math.random() > 0.7, // 30% chance for italic
        weight: randomWeight,
      },
      particleRadius: getRandomValueForSetting('particleRadius'),
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
    });
  }, [workerActions]);

  return (
    <div className="controls-container">
      <div className="control-group effects-preset-group">
        <label htmlFor="effectsPreset" style={{opacity: 0.5}}>Effects Preset:</label>
        <select
          id="effectsPreset"
          disabled
          style={{
            opacity: 0.5,
            cursor: 'not-allowed',
            backgroundColor: '#f5f5f5',
            color: '#999'
          }}
        >
          <option value="custom">Custom (No Preset)</option>
          <option value="snow">Snow</option>
          <option value="smoke">Smoke</option>
          <option value="fire">Fire</option>
          <option value="neon">Neon Glow</option>
          <option value="matrix">Matrix Code</option>
        </select>
      </div>
      <TextInput />
      <MultiColorPicker />
      <FontSettings />
      <ParticleDensity />
      <ParticleSpread />
      <div className="control-group">
        <label htmlFor="particleShape" style={{opacity: 0.5}}>Particle Shape:</label>
        <select
          id="particleShape"
          disabled
          style={{
            opacity: 0.5,
            cursor: 'not-allowed',
            backgroundColor: '#f5f5f5',
            color: '#999'
          }}
        >
          <option value="circle">Circle</option>
          <option value="square">Square</option>
          <option value="triangle">Triangle</option>
          <option value="line">Line</option>
          <option value="star">Star</option>
        </select>
      </div>
      <ParticleOrigin />
      <ParticleSize />
      <ParticleDelay />
      <ParticleOpacity />
      <AnimationDuration />

      <div className="control-group" style={{gridColumn: '1 / -1', display: 'flex', flexDirection: 'row', gap: '20px'}}>
        <button onClick={onPlay} style={{flex: '1 1 0'}}>Play Animation</button>
        <button onClick={shuffleSettings} className="shuffle-button" style={{flex: '1 1 0'}}>Shuffle Settings</button>
        <div style={{flex: '1 1 0'}}>
          <ShareButton />
        </div>
      </div>
    </div>
  );
};
