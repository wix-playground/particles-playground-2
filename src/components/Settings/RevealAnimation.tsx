import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';

export const RevealAnimation = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();

  const handleEnableChange = useCallback((enabled: boolean) => {
    workerActions?.updateRevealAnimation(enabled);
  }, [workerActions]);

  if (!appProps) {
    return null;
  }

  return (
    <div className="control-group">
      <label htmlFor="enableRevealAnimation">Enable Reveal Animation:</label>
      <input
        type="checkbox"
        id="enableRevealAnimation"
        checked={appProps.enableRevealAnimation}
        onChange={(e) => handleEnableChange(e.target.checked)}
      />
    </div>
  );
};
