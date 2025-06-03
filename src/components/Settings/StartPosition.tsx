import {useCallback, useContext} from 'react';
import {Arrow} from '../../assets/Arrow';
import {CenterFilled} from '../../assets/CenterFilled';
import {StartPositionType} from '../../interfaces';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';

export const StartPosition = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();

  const handleSelect = useCallback(
    (id: StartPositionType) => {
      workerActions?.updateStartPosition(id);
    },
    [workerActions]
  );

  const config: {id: Omit<StartPositionType, 'random'>; transform: string}[][] =
    [
      [
        {id: 'top-left', transform: 'rotate(-45deg)'},
        {
          id: 'left',
          transform: 'rotate(-90deg)',
        },
        {
          id: 'bottom-left',
          transform: 'rotate(-135deg)',
        },
      ],
      [
        {
          id: 'top',
          transform: '',
        },
        {
          id: 'center',
          transform: '',
        },
        {
          id: 'bottom',
          transform: 'rotate(180deg)',
        },
      ],
      [
        {
          id: 'top-right',
          transform: 'rotate(-300deg)',
        },
        {
          id: 'right',
          transform: 'rotate(-270deg)',
        },
        {
          id: 'bottom-right',
          transform: 'rotate(-235deg)',
        },
      ],
    ];

  if (!appProps) {
    return;
  }

  return (
    <div className="card">
      <span className="innerTitle">Particles start position</span>
      <div style={{display: 'flex'}}>
        <label htmlFor="random-position-toggle" style={{textAlign: 'start'}}>
          Use random start position:
        </label>
        <input
          type="checkbox"
          id="random-position-toggle"
          checked={appProps.startPosition === 'random'}
          onChange={() => {
            if (appProps.startPosition !== 'random') {
              handleSelect('random');
            }
          }}
        />
      </div>
      <div className="card" style={{flexDirection: 'row', gap: '4px'}}>
        {config.map((column, i) => (
          <div
            style={{display: 'flex', flexDirection: 'column', gap: '4px'}}
            key={i}
          >
            {column.map(({transform, id}) => (
              <button
                key={id as string}
                id={id as string}
                className={`iconButton ${appProps?.startPosition === id ? 'selected' : ''
                  }`}
                onClick={() => handleSelect(id as StartPositionType)}
              >
                {id === 'center' ? (
                  <CenterFilled />
                ) : (
                  <Arrow style={{transform}} />
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
