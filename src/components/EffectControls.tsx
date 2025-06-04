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
import {ShuffleSettingsButton} from './ShuffleSettingsButton';
import {MovementEasingDropdown} from './Settings/MovementEasingDropdown';
import {RevealAnimation} from './Settings/RevealAnimation';

interface EffectControlsProps {
  onPlay: () => void;
}
export const EffectControls = ({onPlay}: EffectControlsProps) => {

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

      <MovementEasingDropdown />

      <RevealAnimation />

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
        <ShuffleSettingsButton />
        <ShareButton />
      </div>
    </div>
  );
};
