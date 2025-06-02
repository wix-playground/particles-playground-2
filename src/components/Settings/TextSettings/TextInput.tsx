import {useContext, useCallback, useMemo} from 'react';
import {AppContext} from '../../../contexts/AppContext';
import {WorkerContext} from '../../../contexts/WorkerContext';
import {getUpdateTextMessage} from '../../../interfaces';
import {DATA_TEST_IDS} from '../../../constants';
export const TextInput = () => {
  const worker = useContext(WorkerContext);
  const appProps = useContext(AppContext);

  const fontState = appProps?.font;

  const handleTextChange = useCallback(
    (value: string) => {
      if (worker) worker.postMessage(getUpdateTextMessage(value ?? ''));
    },
    [worker]
  );

  const previewStyle = useMemo(
    () =>
      fontState
        ? {
          fontFamily: `"${fontState.fontFamily}"`,
          fontSize: `24px`,
          fontWeight: fontState.weight,
          fontStyle: fontState.italic ? 'italic' : 'normal',
          letterSpacing: `${fontState.letterSpacing}rem`,
        }
        : {},
    [fontState]
  );

  if (!appProps) {
    return;
  }

  return (
    <textarea
      data-testid={DATA_TEST_IDS.TEXT_INPUT}
      style={previewStyle}
      className="userInput"
      value={appProps.text}
      onChange={(e) => {
        handleTextChange(e.target.value);
      }}
    />
  );
};
