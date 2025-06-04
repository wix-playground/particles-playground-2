import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {RevealDirection as RevealDirectionType} from '../../interfaces';

const revealDirectionOptions: {value: RevealDirectionType, label: string}[] = [
  {value: 'left-to-right', label: 'Left to Right'},
  {value: 'right-to-left', label: 'Right to Left'},
  {value: 'top-to-bottom', label: 'Top to Bottom'},
  {value: 'bottom-to-top', label: 'Bottom to Top'},
];

export const RevealDirection = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();

  const handleRevealDirectionChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedDirection = event.target.value as RevealDirectionType;
      workerActions?.updateRevealDirection(selectedDirection);
    },
    [workerActions]
  );

  if (!appProps || !appProps.enableRevealAnimation) {
    return null;
  }

  return (
    <div className="control-group">
      <label htmlFor="revealDirection">Reveal Direction:</label>
      <select
        id="revealDirection"
        value={appProps.revealDirection}
        onChange={handleRevealDirectionChange}
      >
        {revealDirectionOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
