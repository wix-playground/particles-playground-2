import {useCallback, useContext, useMemo, useRef} from 'react';
import './FunctionSelectorModal.css';
import {Action} from '../../interfaces';
import {getPredefinedMovementOptions} from '../../movement';
import {WorkerContext} from '../../contexts/WorkerContext';
import {SineIn} from '../../assets/easings/SineIn';
import {SineOut} from '../../assets/easings/SineOut';
import {SineInOut} from '../../assets/easings/SineInOut';
import {CubicIn} from '../../assets/easings/CubicIn';

export const FunctionSelectorModal = () => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const worker = useContext(WorkerContext);

  const predefinedMovementOptions = useMemo(
    () => getPredefinedMovementOptions(),
    []
  );

  const optionArray = useMemo(
    () =>
      Object.entries(predefinedMovementOptions).map((entry) => {
        const [name, val] = entry;
        return {name, ...val};
      }),
    [predefinedMovementOptions]
  );

  const handleFunctionSelect = useCallback(
    (option: string) => {
      if (worker)
        worker.postMessage({
          type: Action.UPDATE_SELECTED_MOVEMENT_FUNCTION,
          data: {
            key: option,
            movementFunctionCode: predefinedMovementOptions[option].code,
          },
        });
    },
    [predefinedMovementOptions, worker]
  );

  const illustrationConfig: Record<string, React.ReactNode> = useMemo(
    () => ({
      sineIn: <SineIn />,
      sineOut: <SineOut />,
      sineInOut: <SineInOut />,
      cubicIn: <CubicIn />,
    }),
    []
  );

  return (
    <>
      <dialog ref={dialogRef}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <p>This modal dialog has a groovy backdrop!</p>
          <div className="grid-container">
            {optionArray.map((option) => (
              <a
                id={option.name}
                key={option.name}
                href=""
                onClick={(e) => e.preventDefault()}
              >
                <div
                  id={option.name}
                  key={option.name}
                  className="grid-item"
                  style={{display: 'flex', flexDirection: 'column', gap: '4px'}}
                  onClick={() => {
                    handleFunctionSelect(option.name);
                  }}
                >
                  {illustrationConfig[option.name]}
                  <span>{option.name}</span>
                </div>
              </a>
            ))}
          </div>
          <button
            onClick={() => {
              if (dialogRef.current) {
                dialogRef.current.close();
              }
            }}
          >
            Close
          </button>
        </div>
      </dialog>
      <button
        onClick={() => {
          if (dialogRef.current) {
            console.log('show dialog!');
            dialogRef.current.showModal();
          }
        }}
      >
        Show the dialog
      </button>
    </>
  );
};
