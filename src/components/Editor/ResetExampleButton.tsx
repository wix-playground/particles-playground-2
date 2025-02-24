import {useCallback, useContext} from 'react';
import {WorkerContext} from '../../contexts/WorkerContext';
import {Action} from '../../interfaces';
import {DEFAULT_MOVEMENT_FUNCTION_KEY, EXAMPLE_CODE} from '../../constants';
import {AppContext} from '../../contexts/AppContext';

export const ResetExampleButton = () => {
  const appProps = useContext(AppContext);
  const worker = useContext(WorkerContext);

  const handleResetCode = useCallback(() => {
    if (worker) {
      worker.postMessage({
        type: Action.UPDATE_SELECTED_MOVEMENT_FUNCTION,
        data: {
          key: DEFAULT_MOVEMENT_FUNCTION_KEY,
          movementFunctionCode: EXAMPLE_CODE,
        },
      });
    }
  }, [worker]);

  if (!appProps) {
    return;
  }

  return (
    <button
      disabled={appProps.movementFunctionCode === EXAMPLE_CODE}
      onClick={handleResetCode}
    >
      Reset code to example
    </button>
  );
};
