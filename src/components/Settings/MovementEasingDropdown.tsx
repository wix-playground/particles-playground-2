import {useCallback, useContext, useMemo} from 'react';
import {getPredefinedMovementOptions} from '../../movement';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {AppContext} from '../../contexts/AppContext';

export const MovementEasingDropdown = () => {
  const workerActions = useWorkerActions();
  const appProps = useContext(AppContext);

  const predefinedMovementOptions = useMemo(
    () => getPredefinedMovementOptions(),
    []
  );

  const movementOptionArray = useMemo(
    () =>
      Object.entries(predefinedMovementOptions)
        .filter(([name]) => !name.includes('DEV'))
        .map(([name, val]) => ({name, ...val})),
    [predefinedMovementOptions]
  );

  const handleMovementFunctionChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOption = event.target.value;
      if (workerActions && predefinedMovementOptions[selectedOption]) {
        workerActions.updateSelectedMovementFunction(
          selectedOption,
          predefinedMovementOptions[selectedOption].code
        );
      }
    },
    [predefinedMovementOptions, workerActions]
  );

  return (
    <div className="control-group">
      <label htmlFor="movementEasing">Movement Easing:</label>
      <select
        id="movementEasing"
        value={appProps?.selectedMovementFunction || 'default'}
        onChange={handleMovementFunctionChange}
      >
        {movementOptionArray.map((option) => (
          <option key={option.name} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};
