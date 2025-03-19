import {useContext, useCallback, useMemo} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {WorkerContext} from '../../contexts/WorkerContext';
import {getUpdateTextMessage} from '../../interfaces';

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
            maxWidth: '250px',
          }
        : {},
    [fontState]
  );

  if (!appProps) {
    return;
  }

  return (
    <>
      <span className="innerTitle">Text</span>
      <input
        style={previewStyle}
        className="userInput"
        value={appProps.text}
        onChange={(e) => {
          handleTextChange(e.target.value);
        }}
      />
    </>
  );
};
