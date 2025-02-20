import {editor} from 'monaco-editor';
import {useState, useCallback, useMemo} from 'react';
import {getPredefinedMovementOptions} from '../movement';
import {StartPosition} from './StartPosition';

export const Settings = ({
  workerRef,
  editorRef,
  setSelectedMovementFunction,
  selectedMovementFunction,
}: {
  workerRef: React.RefObject<Worker | null>;
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
  selectedMovementFunction: string | null;
  setSelectedMovementFunction: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}) => {
  const [particleRadius, setParticleRadius] = useState<number>(2);
  const resizeParticleRadius = useCallback((radius: number) => {
    workerRef.current?.postMessage({
      type: 'resizeParticleRadius',
      data: {particleRadius: radius},
    });
  }, []);

  const handlePredefinedMovementClick = (option: string) => {
    setSelectedMovementFunction(option);
    editorRef.current?.setValue(predefinedMovementOptions[option]);
  };

  const play = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }

    workerRef.current?.postMessage({
      type: 'play',
      data: {
        code: editorRef.current?.getValue(),
      },
    });
  }, []);

  const reset = useCallback(() => {
    workerRef.current?.postMessage({type: 'reset'});
  }, []);

  const predefinedMovementOptions = useMemo(
    () => getPredefinedMovementOptions(),
    []
  );

  const movementOptionKeys = useMemo(() => {
    return Object.keys(predefinedMovementOptions);
  }, [predefinedMovementOptions]);

  return (
    <div className="layout card" style={{width: '30%'}}>
      <span className="cardTitle">Settings</span>
      <div style={{display: 'flex', gap: '4px'}}>
        <button onClick={play}>Play animation</button>
        <button onClick={reset}>Reset particles</button>
      </div>
      <div>
        Particle radius:
        <input
          value={particleRadius}
          type="number"
          onChange={(e) => {
            const numberValue = Number(e.target.value);
            if (!Number.isNaN(numberValue) && numberValue > 0) {
              setParticleRadius(numberValue);
              resizeParticleRadius(numberValue);
            }
          }}
        />
      </div>
      <StartPosition workerRef={workerRef} />
      <div>Text: TBD</div>
      <div>Text size???: TBD</div>
      <div>Text color: TBD</div>
      <div className="card">
        <span className="innerTitle">Predefined movement functions:</span>
        {movementOptionKeys.map((option) => (
          <button
            className={
              selectedMovementFunction === option ? 'selected' : undefined
            }
            key={option}
            onClick={() => handlePredefinedMovementClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
