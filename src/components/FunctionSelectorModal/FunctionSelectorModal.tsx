import {useCallback, useContext, useMemo, useRef} from 'react';
import './FunctionSelectorModal.css';
import {Action} from '../../interfaces';
import {getPredefinedMovementOptions} from '../../movement';
import {WorkerContext} from '../../contexts/WorkerContext';
import {
  SineIn,
  SineOut,
  SineInOut,
  CubicIn,
  CubicOut,
  CubicInOut,
  QuintOut,
  QuintInOut,
  CircIn,
  CircOut,
  CircInOut,
  QuadIn,
  QuadOut,
  QuadInOut,
  QuartIn,
  QuartOut,
  QuartInOut,
  ExpoIn,
  ExpoOut,
  ExpoInOut,
  BackIn,
  BackOut,
  BackInOut,
  Bezier,
  Linear,
  QuintIn,
} from '../../assets/easings';
import {AppContext} from '../../contexts/AppContext';
export const FunctionSelectorModal = ({onSelect}: {onSelect: () => void}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const worker = useContext(WorkerContext);
  const appProps = useContext(AppContext);

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
      if (worker) {
        worker.postMessage({
          type: Action.UPDATE_SELECTED_MOVEMENT_FUNCTION,
          data: {
            key: option,
            movementFunctionCode: predefinedMovementOptions[option].code,
          },
        });
        if (dialogRef.current) {
          dialogRef.current.close();
        }
      }
      onSelect();
    },

    [predefinedMovementOptions, worker, onSelect]
  );

  const illustrationConfig: Record<string, React.ReactNode> = useMemo(
    () => ({
      sineIn: <SineIn />,
      sineOut: <SineOut />,
      sineInOut: <SineInOut />,
      cubicIn: <CubicIn />,
      cubicOut: <CubicOut />,
      cubicInOut: <CubicInOut />,
      quintIn: <QuintIn />,
      quintOut: <QuintOut />,
      quintInOut: <QuintInOut />,
      circIn: <CircIn />,
      circOut: <CircOut />,
      circInOut: <CircInOut />,
      quadIn: <QuadIn />,
      quadOut: <QuadOut />,
      quadInOut: <QuadInOut />,
      quartIn: <QuartIn />,
      quartOut: <QuartOut />,
      quartInOut: <QuartInOut />,
      expoIn: <ExpoIn />,
      expoOut: <ExpoOut />,
      expoInOut: <ExpoInOut />,
      backIn: <BackIn />,
      backOut: <BackOut />,
      backInOut: <BackInOut />,
      bezier: <Bezier />,
      linear: <Linear />,
    }),
    []
  );

  return (
    <>
      <dialog ref={dialogRef} style={{margin: '2em 15em', padding: '0 3em'}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div className="grid-container">
            {optionArray.map(
              (option) =>
                !option.name.includes('DEV') && (
                  <a
                    className={
                      appProps?.selectedMovementFunction === option.name
                        ? 'selected'
                        : undefined
                    }
                    id={option.name}
                    key={option.name}
                    href=""
                    onClick={(e) => e.preventDefault()}
                  >
                    <div
                      id={option.name}
                      key={option.name}
                      className="grid-item"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                      onClick={() => {
                        handleFunctionSelect(option.name);
                      }}
                    >
                      {illustrationConfig[option.name]}
                      <span>{option.name}</span>
                    </div>
                  </a>
                )
            )}
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
            dialogRef.current.showModal();
          }
        }}
      >
        Select predefined movement function
      </button>
    </>
  );
};
