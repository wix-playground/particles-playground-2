import {useCallback, useContext} from 'react';
import {AppContext} from '../../../contexts/AppContext';
import {useWorkerActions} from '../../../hooks/useWorkerActions';

export const TextColorPicker = () => {
  const workerActions = useWorkerActions();
  const appProps = useContext(AppContext);

  const handleTextColorChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const color = event.target.value;
      workerActions?.updateTextColor(color);
    },
    [workerActions]
  );

  if (!appProps) return null;

  return (
    <div className="control-group">
      <label htmlFor="textColor">Text Color:</label>
      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
        <input
          id="textColor"
          type="color"
          value={appProps.textColor || '#ffffff'}
          onChange={handleTextColorChange}
          style={{
            width: '40px',
            height: '30px',
            border: '1px solid #444',
            borderRadius: '4px',
            backgroundColor: '#2D3748',
            cursor: 'pointer'
          }}
        />
        <span style={{fontSize: '12px', color: '#ccc'}}>
          {appProps.textColor || '#ffffff'}
        </span>
      </div>
    </div>
  );
};
