import {useCallback, useContext, useMemo, useRef} from 'react';
import './FunctionSelectorModal.css';
import {getPredefinedMovementOptions} from '../../movement';
import {useWorkerActions} from '../../hooks/useWorkerActions';
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
  ElasticIn,
  ElasticInOut,
  ElasticOut,
  PulseColorCycle,
  TimeDistortion,
  ElasticPlop,
} from '../../assets/easings';
import {AppContext} from '../../contexts/AppContext';
export const FunctionSelectorModal = ({onSelect}: {onSelect: () => void}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const workerActions = useWorkerActions();
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
      if (workerActions) {
        workerActions.updateSelectedMovementFunction(option, predefinedMovementOptions[option].code);
        if (dialogRef.current) {
          dialogRef.current.close();
        }
      }
      onSelect();
    },

    [predefinedMovementOptions, workerActions, onSelect]
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
      elasticIn: <ElasticIn />,
      elasticOut: <ElasticOut />,
      elasticInOut: <ElasticInOut />,
      pulseColorCycle: <PulseColorCycle />,
      timeDistortion: <TimeDistortion />,
      elasticPlop: <ElasticPlop />,
    }),
    []
  );

  return (
    <>
      <dialog
        ref={dialogRef}
        style={{
          margin: '2em 15em',
          padding: '0 3em',
          borderRadius: '1em',
          borderWidth: '2px',
        }}
      >
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
