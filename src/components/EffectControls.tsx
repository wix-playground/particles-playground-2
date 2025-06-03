import {useCallback, useState, useContext} from 'react';
import {TextInput} from './Settings/TextSettings/TextInput';
import {FontSettings} from './Settings/TextSettings/FontSettings';
import {MultiColorPicker} from './Settings/MultiColorPicker';
import {WorkerContext} from '../contexts/WorkerContext';
import {ParticleDensity} from './Settings/ParticleDensity';
import {ParticleSpread} from './Settings/ParticleSpread';
import {ParticleOpacity} from './Settings/ParticleOpacity';
import {ParticleSize} from './Settings/ParticleSize';
import {AnimationDuration} from './Settings/AnimationDuration';
import {ShareButton} from './ShareButton';
import {ParticleDelay} from './Settings/ParticleDelay';

interface EffectControlsProps {
  onPlay: () => void;
  onReset: () => void;
}

interface ControlState {
  effectsPreset: string;
  particleShape: string;
  particleOrigin: string;
  sourceCloudAngle: number;
  emitterX: number;
  emitterY: number;
  emitterSize: number;
  maxDelay: number;
}

export const EffectControls = ({onPlay}: EffectControlsProps) => {
  const worker = useContext(WorkerContext);

  const [controlState, setControlState] = useState<ControlState>({
    effectsPreset: 'custom',
    particleShape: 'circle',
    particleOrigin: 'random',
    sourceCloudAngle: 0,
    emitterX: 500,
    emitterY: 300,
    emitterSize: 100,
    maxDelay: 700,
  });

  const handleControlChange = useCallback((field: keyof ControlState, value: any) => {
    setControlState(prev => ({...prev, [field]: value}));
  }, [worker]);

  const shuffleSettings = useCallback(() => {
    const presets = ['snow', 'smoke', 'fire', 'neon', 'matrix'];
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];

    setControlState(prev => ({
      ...prev,
      effectsPreset: randomPreset,
      maxDelay: Math.floor(Math.random() * 3000) + 100,
    }));
  }, []);

  const isEmitterOrigin = controlState.particleOrigin.startsWith('emitter');

  return (
    <div className="controls-container">
      {/* Effects Preset */}
      <div className="control-group effects-preset-group">
        <label htmlFor="effectsPreset">Effects Preset:</label>
        <select
          id="effectsPreset"
          value={controlState.effectsPreset}
          onChange={(e) => handleControlChange('effectsPreset', e.target.value)}
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
      {/* Particle Shape */}
      <div className="control-group">
        <label htmlFor="particleShape">Particle Shape:</label>
        <select
          id="particleShape"
          value={controlState.particleShape}
          onChange={(e) => handleControlChange('particleShape', e.target.value)}
        >
          <option value="circle">Circle</option>
          <option value="square">Square</option>
          <option value="triangle">Triangle</option>
          <option value="line">Line</option>
          <option value="star">Star</option>
        </select>
      </div>
      {/* Particle Origin */}
      <div className="control-group">
        <label htmlFor="particleOrigin">Particle Origin Type:</label>
        <select
          id="particleOrigin"
          value={controlState.particleOrigin}
          onChange={(e) => handleControlChange('particleOrigin', e.target.value)}
        >
          <option value="random">Random Spread</option>
          <option value="canvasEdges">From Canvas Edges</option>
          <option value="center">From Canvas Center</option>
          <option value="topLeft">From Top-Left</option>
          <option value="emitterPoint">Emitter: Point</option>
          <option value="emitterCircle">Emitter: Circle</option>
          <option value="emitterSquare">Emitter: Square</option>
          <option value="emitterHLine">Emitter: Horizontal Line</option>
          <option value="emitterVLine">Emitter: Vertical Line</option>
          <option value="enterTopTextWidth">Text Aligned: Top Edge</option>
          <option value="enterBottomTextWidth">Text Aligned: Bottom Edge</option>
          <option value="enterLeftTextHeight">Text Aligned: Left Edge</option>
          <option value="enterRightTextHeight">Text Aligned: Right Edge</option>
        </select>
      </div>

      {/* Source Cloud Angle */}
      <div className="control-group">
        <label htmlFor="sourceCloudAngle">Source Cloud/Emitter Angle (°):</label>
        <div className="slider-input-group">
          <input
            type="range"
            min="-360"
            max="360"
            value={controlState.sourceCloudAngle}
            onChange={(e) => handleControlChange('sourceCloudAngle', Number(e.target.value))}
          />
          <input
            type="number"
            min="-360"
            max="360"
            value={controlState.sourceCloudAngle}
            onChange={(e) => handleControlChange('sourceCloudAngle', Number(e.target.value))}
          />
        </div>
      </div>

      {/* Emitter Controls (conditionally shown) */}
      {isEmitterOrigin && (
        <>
          <div className="control-group">
            <label htmlFor="emitterX">Emitter X Position:</label>
            <div className="slider-input-group">
              <input
                type="range"
                min="0"
                max="1000"
                value={controlState.emitterX}
                onChange={(e) => handleControlChange('emitterX', Number(e.target.value))}
              />
              <input
                type="number"
                min="0"
                max="1000"
                value={controlState.emitterX}
                onChange={(e) => handleControlChange('emitterX', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="control-group">
            <label htmlFor="emitterY">Emitter Y Position:</label>
            <div className="slider-input-group">
              <input
                type="range"
                min="0"
                max="600"
                value={controlState.emitterY}
                onChange={(e) => handleControlChange('emitterY', Number(e.target.value))}
              />
              <input
                type="number"
                min="0"
                max="600"
                value={controlState.emitterY}
                onChange={(e) => handleControlChange('emitterY', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="control-group">
            <label htmlFor="emitterSize">Emitter Radius:</label>
            <div className="slider-input-group">
              <input
                type="range"
                min="1"
                max="300"
                value={controlState.emitterSize}
                onChange={(e) => handleControlChange('emitterSize', Number(e.target.value))}
              />
              <input
                type="number"
                min="1"
                max="300"
                value={controlState.emitterSize}
                onChange={(e) => handleControlChange('emitterSize', Number(e.target.value))}
              />
            </div>
          </div>
        </>
      )}
      <ParticleSize />
      <ParticleDelay />
      <ParticleOpacity />
      <AnimationDuration />

      {/* Action Buttons */}
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
