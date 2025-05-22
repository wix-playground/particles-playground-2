import {useCallback, useContext} from 'react';
import {getUpdateEnableBubblesMessage} from '../../interfaces';
import {WorkerContext} from '../../contexts/WorkerContext';
import {AppContext} from '../../contexts/AppContext';

export const BubbleEffectToggle = () => {
  const worker = useContext(WorkerContext);
  const appProps = useContext(AppContext);

  const handleToggleBubbles = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (worker) {
        worker.postMessage(getUpdateEnableBubblesMessage(event.target.checked));
      }
    },
    [worker]
  );

  if (!appProps) return null;

  return (
    <div className="settings-item">
      <div className="settings-item-header">
        <span>Bubble Effect</span>
        <input
          className="userInput"
          type="checkbox"
          id="bubble-toggle"
          checked={appProps.enableBubbles}
          onChange={handleToggleBubbles}
        />
      </div>
    </div>
  );
};
