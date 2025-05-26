import {useCallback, useContext} from 'react';
import {StartPosition} from './StartPosition';
import {getResizeParticleRadiusMessage} from '../../interfaces';
import {AppContext} from '../../contexts/AppContext';
import {WorkerContext} from '../../contexts/WorkerContext';
import {FunctionSelectorModal} from '../FunctionSelectorModal/FunctionSelectorModal';
import {editor} from 'monaco-editor';
import {MultiColorPicker} from './MultiColorPicker';
import {PulseColorSettings} from './PulseColorSettings';
import {TimeDistortionSettings} from './TimeDistortionSettings';
import {TextSettings} from './TextSettings';
import {AnimationDurationSlider} from './AnimationDurationSlider';
import {BubbleEffectToggle} from './BubbleEffectToggle';

export const Settings = ({
  editorRef,
}: {
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
}) => {
  const worker = useContext(WorkerContext);
  const appProps = useContext(AppContext);

  const handleResizeParticleRadius = useCallback(
    (radius: number) => {
      if (worker) worker.postMessage(getResizeParticleRadiusMessage(radius));
    },
    [worker]
  );

  if (!appProps) {
    return;
  }

  return (
    <div className="card">
      <span className="cardTitle">Settings</span>
      <div
        style={{
          display: 'flex',
          alignItems: 'start',
          gap: '4px',
          flexDirection: 'column',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
          Particle radius:
          <input
            className="userInput"
            style={{maxWidth: '60px'}}
            value={appProps.particleRadius}
            type="number"
            onChange={(e) => {
              const numberValue = Number(e.target.value);
              if (!Number.isNaN(numberValue) && numberValue > 0) {
                handleResizeParticleRadius(numberValue);
              }
            }}
          />
          <BubbleEffectToggle />
        </div>
        <MultiColorPicker />
        <StartPosition />
        <AnimationDurationSlider />
        <div className="card">
          <span className="innerTitle">Predefined movement functions</span>
          <FunctionSelectorModal
            onSelect={() => {
              if (editorRef.current) {
                editorRef.current
                  .getAction('editor.action.formatDocument')
                  ?.run();
              }
            }}
          />
        </div>

        {appProps.selectedMovementFunction === 'pulseColorCycle' && (
          <PulseColorSettings />
        )}
        {appProps.selectedMovementFunction === 'timeDistortion' && (
          <TimeDistortionSettings />
        )}
        <TextSettings />
      </div>
    </div>
  );
};
