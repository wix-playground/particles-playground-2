import {editor} from 'monaco-editor';
import {useState, useCallback, useMemo, useRef} from 'react';
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
  selectedMovementFunction: string;
  setSelectedMovementFunction: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [particleRadius, setParticleRadius] = useState<number>(2);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const resizeParticleRadius = useCallback((radius: number) => {
    workerRef.current?.postMessage({
      type: 'resizeParticleRadius',
      data: {particleRadius: radius},
    });
  }, []);

  const predefinedMovementOptions = useMemo(
    () => getPredefinedMovementOptions(),
    []
  );

  const movementOptionKeys = useMemo(
    () => Object.keys(predefinedMovementOptions),
    [predefinedMovementOptions]
  );

  const handleFunctionSelect = () => {
    if (selectRef.current) {
      const option = selectRef.current.value;
      setSelectedMovementFunction(option);
      editorRef.current?.setValue(predefinedMovementOptions[option]);
    }
  };

  return (
    <div className="layout card" style={{width: '30%'}}>
      <span className="cardTitle">Settings</span>
      <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
        Particle radius:
        <input
          className="userInput"
          style={{maxWidth: '60px'}}
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
        <span className="innerTitle">Predefined movement functions</span>
        <select
          id="predefined-function-select"
          ref={selectRef}
          onChange={handleFunctionSelect}
          value={selectedMovementFunction}
          className="userInput"
        >
          {movementOptionKeys.map((option) => (
            <option id={option} value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
