import {useContext, useCallback, useMemo} from 'react';
import {AppContext} from '../../../contexts/AppContext';
import {useWorkerActions} from '../../../hooks/useWorkerActions';
import {DATA_TEST_IDS} from '../../../constants';
export const TextInput = () => {
  const workerActions = useWorkerActions();
  const appProps = useContext(AppContext);

  const fontState = appProps?.font;

  const handleTextChange = useCallback(
    (value: string) => {
      workerActions?.updateText(value ?? '');
    },
    [workerActions]
  );

  const previewStyle = useMemo(
    () =>
      fontState
        ? {
          fontFamily: `"${fontState.fontFamily}"`,
          fontSize: `24px`,
          fontWeight: fontState.weight,
          fontStyle: fontState.italic ? 'italic' : 'normal',
          color: appProps?.textColor || '#ffffff',
          whiteSpace: 'pre-line' as const,
        }
        : {},
    [fontState, appProps?.textColor]
  );

  if (!appProps) {
    return;
  }

  return (
    <div className="control-group" style={{gridColumn: 'span 2', gridRow: 'span 2'}}>
      <label htmlFor="textInput">Text</label>
      <textarea
        data-testid={DATA_TEST_IDS.TEXT_INPUT}
        style={previewStyle}
        className="userInput"
        value={appProps.text}
        onChange={(e) => {
          handleTextChange(e.target.value);
        }}
      />
    </div>
  );
};
