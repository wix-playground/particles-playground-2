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

interface EffectControlsProps {
  onPlay: () => void;
}

export const EffectControls = ({onPlay}: EffectControlsProps) => {

  const shuffleSettings = useCallback(() => {
    // TODO: Implement shuffle logic for implemented settings only
  }, []);

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
      <div className="control-group">
        <label htmlFor="particleOrigin" style={{opacity: 0.5}}>Particle Origin Type:</label>
        <select
          id="particleOrigin"
          disabled
          style={{
            opacity: 0.5,
            cursor: 'not-allowed',
            backgroundColor: '#f5f5f5',
            color: '#999'
          }}
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

      <div className="control-group">
        <label htmlFor="sourceCloudAngle" style={{opacity: 0.5}}>Source Cloud/Emitter Angle (°):</label>
        <div className="slider-input-group">
          <input
            type="range"
            min="-360"
            max="360"
            defaultValue="0"
            disabled
            style={{
              opacity: 0.5,
              cursor: 'not-allowed'
            }}
          />
          <input
            type="number"
            min="-360"
            max="360"
            defaultValue="0"
            disabled
            style={{
              opacity: 0.5,
              cursor: 'not-allowed',
              backgroundColor: '#f5f5f5',
              color: '#999'
            }}
          />
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="emitterX" style={{opacity: 0.5}}>Emitter X Position:</label>
        <div className="slider-input-group">
          <input
            type="range"
            min="0"
            max="1000"
            defaultValue="500"
            disabled
            style={{
              opacity: 0.5,
              cursor: 'not-allowed'
            }}
          />
          <input
            type="number"
            min="0"
            max="1000"
            defaultValue="500"
            disabled
            style={{
              opacity: 0.5,
              cursor: 'not-allowed',
              backgroundColor: '#f5f5f5',
              color: '#999'
            }}
          />
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="emitterY" style={{opacity: 0.5}}>Emitter Y Position:</label>
        <div className="slider-input-group">
          <input
            type="range"
            min="0"
            max="600"
            defaultValue="300"
            disabled
            style={{
              opacity: 0.5,
              cursor: 'not-allowed'
            }}
          />
          <input
            type="number"
            min="0"
            max="600"
            defaultValue="300"
            disabled
            style={{
              opacity: 0.5,
              cursor: 'not-allowed',
              backgroundColor: '#f5f5f5',
              color: '#999'
            }}
          />
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="emitterSize" style={{opacity: 0.5}}>Emitter Radius:</label>
        <div className="slider-input-group">
          <input
            type="range"
            min="1"
            max="300"
            defaultValue="100"
            disabled
            style={{
              opacity: 0.5,
              cursor: 'not-allowed'
            }}
          />
          <input
            type="number"
            min="1"
            max="300"
            defaultValue="100"
            disabled
            style={{
              opacity: 0.5,
              cursor: 'not-allowed',
              backgroundColor: '#f5f5f5',
              color: '#999'
            }}
          />
        </div>
      </div>
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
