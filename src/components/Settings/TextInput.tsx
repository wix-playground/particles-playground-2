import {useContext, useCallback} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {WorkerContext} from '../../contexts/WorkerContext';
import {getUpdateTextMessage} from '../../interfaces';

export const TextInput = () => {
  const worker = useContext(WorkerContext);
  const appProps = useContext(AppContext);

  const handleTextChange = useCallback(
    (value: string) => {
      if (worker) worker.postMessage(getUpdateTextMessage(value ?? ''));
    },
    [worker]
  );

  if (!appProps) {
    return;
  }

  return (
    <div className="card">
      <span className="innerTitle">Text</span>
      <input
        className="userInput"
        value={appProps.text}
        onChange={(e) => {
          handleTextChange(e.target.value);
        }}
      />
    </div>
  );
};
