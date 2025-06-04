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
import {RevealDirection} from './Settings/RevealDirection';
import {useContext, useCallback} from 'react';
import {AppContext} from '../contexts/AppContext';
import {useWorkerActions} from '../hooks/useWorkerActions';

interface EffectControlsProps {
  onPlay: () => void;
}
export const EffectControls = ({onPlay}: EffectControlsProps) => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();

  const handleEffectModeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const isRevealMode = event.target.value === 'reveal';
      workerActions?.updateRevealAnimation(isRevealMode);
    },
    [workerActions]
  );

  return (
    <div className="controls-container">
      <div className="control-group effects-preset-group">
        <label htmlFor="effectsPreset">Effect Mode:</label>
        <select
          id="effectsPreset"
          value={appProps?.enableRevealAnimation ? 'reveal' : 'movement'}
          onChange={handleEffectModeChange}
        >
          <option value="movement">Movement easing</option>
          <option value="reveal">Reveal</option>
        </select>
      </div>

      {!appProps?.enableRevealAnimation && <MovementEasingDropdown />}

      {appProps?.enableRevealAnimation && <RevealDirection />}

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
      {!appProps?.enableRevealAnimation && <ParticleOrigin />}
      <ParticleSize />
      {!appProps?.enableRevealAnimation && <ParticleDelay />}
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
