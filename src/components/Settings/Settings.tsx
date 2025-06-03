import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {StartPosition} from './StartPosition';
import {FunctionSelectorModal} from '../FunctionSelectorModal/FunctionSelectorModal';
import {editor} from 'monaco-editor';
import {MultiColorPicker} from './MultiColorPicker';
import {TimeDistortionSettings} from './TimeDistortionSettings';
import {ElasticPlopSettings} from './ElasticPlopSettings';
import {TextSettings} from './TextSettings';
// import {BubbleEffectToggle} from './BubbleEffectToggle'; // Commented out - missing bubble functionality
// import {ParticleDensity} from './ParticleDensity'; // Unused import
// import {Tooltip} from './Tooltip'; // Missing module
import './Settings.css';

export const Settings = ({
  editorRef,
}: {
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
}) => {
  const workerActions = useWorkerActions();
  const appProps = useContext(AppContext);

  const handleResizeParticleRadius = useCallback(
    (radius: number) => {
      workerActions?.updateParticleRadius(radius);
    },
    [workerActions]
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
          {/* <BubbleEffectToggle /> */}
        </div>
        <MultiColorPicker />
        <StartPosition />
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
        {appProps.selectedMovementFunction === 'timeDistortion' && (
          <TimeDistortionSettings />
        )}
        {appProps.selectedMovementFunction === 'elasticPlop' && (
          <ElasticPlopSettings />
        )}
        <TextSettings />
      </div>
    </div>
  );
};
