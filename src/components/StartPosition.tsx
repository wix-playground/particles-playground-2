import {useCallback, useState} from 'react';
import {Arrow} from '../assets/Arrow';
import {CenterFilled} from '../assets/CenterFilled';
import {Action, StartPositionType} from '../interfaces';
import {DEFAULT_START_POSITION} from '../constants';

export const StartPosition = ({
  workerRef,
}: {
  workerRef: React.RefObject<Worker | null>;
}) => {
  const [selectedStartPosition, setSelectedStartPosition] =
    useState<StartPositionType | null>(DEFAULT_START_POSITION);

  const handleSelect = useCallback((id: StartPositionType) => {
    setSelectedStartPosition(id);

    workerRef.current?.postMessage({
      type: Action.UPDATE_START_POSITION,
      data: {startPosition: id},
    });
  }, []);

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

  return (
    <div className="card">
      <span className="innerTitle">Particles start position</span>
      <div style={{display: 'flex'}}>
        <label htmlFor="random-position-toggle">
          Use random start position:
        </label>
        <input
          type="checkbox"
          id="random-position-toggle"
          style={{width: '16px', height: '16px'}}
          checked={selectedStartPosition === 'random'}
          onChange={() => {
            if (selectedStartPosition !== 'random') {
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
                className={`iconButton ${
                  selectedStartPosition === id ? 'selected' : ''
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
