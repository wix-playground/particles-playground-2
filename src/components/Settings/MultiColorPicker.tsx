import {useCallback, useContext, useState} from 'react';
import {getUpdateParticleColorsMessage} from '../../interfaces';
import {WorkerContext} from '../../contexts/WorkerContext';
import {AppContext} from '../../contexts/AppContext';

export const MultiColorPicker = () => {
  const worker = useContext(WorkerContext);
  const appProps = useContext(AppContext);
  const [newColor, setNewColor] = useState('#ffffff');

  const handleColorsChange = useCallback(
    (colors: string[]) => {
      if (worker) {
        worker.postMessage(getUpdateParticleColorsMessage(colors));
      }
    },
    [worker]
  );

  const particleColors = appProps?.particleColors || [];

  const addColor = () => {
    if (!appProps) return;

    const newColors = [...particleColors, newColor];
    handleColorsChange(newColors);
  };

  const removeColor = (index: number) => {
    if (!appProps) return;

    const newColors = [...particleColors];
    newColors.splice(index, 1);
    handleColorsChange(newColors);
  };

  if (!appProps) return null;

  return (
    <div className="control-group" style={{gridColumn: 'span 2', gridRow: 'span 2'}}>
      <div style={{width: '100%'}}>
        <label htmlFor="particleColors">Particle Colors Gradient:</label>
        <div style={{marginTop: '8px'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px'}}>
            {particleColors.map((color, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#2D3748',
                  padding: '4px',
                  borderRadius: '4px',
                  border: '1px solid #444'
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    marginRight: '5px',
                    border: '1px solid #888',
                    borderRadius: '2px'
                  }}
                />
                <span style={{marginRight: '5px', fontSize: '12px', color: '#ccc'}}>{color}</span>
                <button
                  onClick={() => removeColor(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#ff4d4d',
                    fontSize: '16px',
                    padding: '0 4px'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              style={{
                width: '40px',
                height: '30px',
                border: '1px solid #444',
                borderRadius: '4px',
                backgroundColor: '#2D3748',
                cursor: 'pointer'
              }}
            />
            <button
              onClick={addColor}
              style={{
                background: '#2D3748',
                border: '1px solid #555',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer',
                color: '#ccc',
                fontSize: '14px'
              }}
            >
              Add Color
            </button>
          </div>
        </div>

        {particleColors.length > 0 && (
          <div style={{
            height: '20px',
            marginTop: '10px',
            width: '100%',
            background: `linear-gradient(to right, ${particleColors.join(', ')})`,
            borderRadius: '4px',
            border: '1px solid #444'
          }} />
        )}
      </div>
    </div>
  );
};
