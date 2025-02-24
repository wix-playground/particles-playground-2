import {useCallback, useContext, useMemo} from 'react';
import {getPredefinedMovementOptions} from '../../movement';
import {WorkerContext} from '../../contexts/WorkerContext';
import {Action} from '../../interfaces';
import MonacoEditor from '@monaco-editor/react';
import {editor} from 'monaco-editor';
import {AppContext} from '../../contexts/AppContext';
import {ResetExampleButton} from './ResetExampleButton';
import {CopyPromptButton} from './CopyPromptButton';

export const Editor = ({
  handleEditorDidMount,
}: {
  handleEditorDidMount: (editor: editor.IStandaloneCodeEditor) => Promise<void>;
}) => {
  const worker = useContext(WorkerContext);
  const appProps = useContext(AppContext);
  const predefinedMovementFunctions = useMemo(
    () => getPredefinedMovementOptions(),
    []
  );

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (worker) {
        const movementFunctionEntries = Object.entries(
          predefinedMovementFunctions
        );

        const predefinedFunctionEntry = movementFunctionEntries.find(
          (entry) => {
            const [, code] = entry;
            return code === value;
          }
        );

        if (predefinedFunctionEntry) {
          const [key, code] = predefinedFunctionEntry;
          worker.postMessage({
            type: Action.UPDATE_SELECTED_MOVEMENT_FUNCTION,
            data: {key, movementFunctionCode: code},
          });
        } else {
          worker.postMessage({
            type: Action.UPDATE_SELECTED_MOVEMENT_FUNCTION,
            data: {movementFunctionCode: value ?? ''},
          });
        }
      }
    },
    [predefinedMovementFunctions, worker]
  );

  return (
    <div
      className="card layout editorContainer"
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <span className="cardTitle">Movement function editor</span>
        <div style={{display: 'flex', gap: '4px'}}>
          <CopyPromptButton />
          <ResetExampleButton />
        </div>
      </div>
      <MonacoEditor
        onMount={handleEditorDidMount}
        height="40vh"
        defaultLanguage="javascript"
        value={appProps?.movementFunctionCode}
        onChange={handleEditorChange}
      />
    </div>
  );
};
