import {useCallback, useContext, useMemo} from 'react';
import {StartPositionType} from '../../interfaces';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {getSettingsConfig} from '../../settings-config';

export const ParticleOrigin = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();
  const {min: MIN_X, max: MAX_X, step: STEP_X} = useMemo(() => getSettingsConfig().emitterX, []);
  const {min: MIN_Y, max: MAX_Y, step: STEP_Y} = useMemo(() => getSettingsConfig().emitterY, []);
  const {min: MIN_SIZE, max: MAX_SIZE, step: STEP_SIZE} = useMemo(() => getSettingsConfig().emitterSize, []);
  const {min: MIN_ANGLE, max: MAX_ANGLE, step: STEP_ANGLE} = useMemo(() => getSettingsConfig().emitterAngle, []);

  const handleOriginChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const startPosition = event.target.value as StartPositionType;
      workerActions?.updateAppProps({startPosition});
    },
    [workerActions]
  );

  const handleEmitterXChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const emitterX = parseFloat(event.target.value);
      workerActions?.updateAppProps({emitterX});
    },
    [workerActions]
  );

  const handleEmitterYChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const emitterY = parseFloat(event.target.value);
      workerActions?.updateAppProps({emitterY});
    },
    [workerActions]
  );

  const handleEmitterSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const emitterSize = parseFloat(event.target.value);
      workerActions?.updateAppProps({emitterSize});
    },
    [workerActions]
  );

  const handleEmitterAngleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const emitterAngle = parseFloat(event.target.value);
      workerActions?.updateAppProps({emitterAngle});
    },
    [workerActions]
  );

  if (!appProps) {
    return null;
  }

  const isEmitterType = appProps.startPosition?.startsWith('emitter');
  const needsEmitterSettings = isEmitterType && appProps.startPosition !== 'emitterPoint';

  return (
    <div className="control-group">
      <label htmlFor="particleOrigin">Particle Origin Type:</label>
      <select
        id="particleOrigin"
        value={appProps.startPosition || 'random'}
        onChange={handleOriginChange}
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

      {isEmitterType && (
        <>
          <div className="control-group">
            <label htmlFor="emitterX">Emitter X Position:</label>
            <div className="slider-input-group">
              <input
                type="range"
                id="emitterX"
                min={MIN_X}
                max={MAX_X}
                step={STEP_X}
                value={appProps.emitterX || 500}
                onChange={handleEmitterXChange}
              />
              <input
                type="number"
                min={MIN_X}
                max={MAX_X}
                step={STEP_X}
                value={appProps.emitterX || 500}
                onChange={handleEmitterXChange}
              />
            </div>
          </div>

          <div className="control-group">
            <label htmlFor="emitterY">Emitter Y Position:</label>
            <div className="slider-input-group">
              <input
                type="range"
                id="emitterY"
                min={MIN_Y}
                max={MAX_Y}
                step={STEP_Y}
                value={appProps.emitterY || 300}
                onChange={handleEmitterYChange}
              />
              <input
                type="number"
                min={MIN_Y}
                max={MAX_Y}
                step={STEP_Y}
                value={appProps.emitterY || 300}
                onChange={handleEmitterYChange}
              />
            </div>
          </div>

          {needsEmitterSettings && (
            <div className="control-group">
              <label htmlFor="emitterSize">Emitter Radius:</label>
              <div className="slider-input-group">
                <input
                  type="range"
                  id="emitterSize"
                  min={MIN_SIZE}
                  max={MAX_SIZE}
                  step={STEP_SIZE}
                  value={appProps.emitterSize || 100}
                  onChange={handleEmitterSizeChange}
                />
                <input
                  type="number"
                  min={MIN_SIZE}
                  max={MAX_SIZE}
                  step={STEP_SIZE}
                  value={appProps.emitterSize || 100}
                  onChange={handleEmitterSizeChange}
                />
              </div>
            </div>
          )}

          {(appProps.startPosition === 'emitterHLine' || appProps.startPosition === 'emitterVLine') && (
            <div className="control-group">
              <label htmlFor="emitterAngle">Emitter Angle (°):</label>
              <div className="slider-input-group">
                <input
                  type="range"
                  id="emitterAngle"
                  min={MIN_ANGLE}
                  max={MAX_ANGLE}
                  step={STEP_ANGLE}
                  value={appProps.emitterAngle || 0}
                  onChange={handleEmitterAngleChange}
                />
                <input
                  type="number"
                  min={MIN_ANGLE}
                  max={MAX_ANGLE}
                  step={STEP_ANGLE}
                  value={appProps.emitterAngle || 0}
                  onChange={handleEmitterAngleChange}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
