import { useCallback, useContext, useState } from 'react';
import { getUpdateParticleColorsMessage } from '../../interfaces';
import { WorkerContext } from '../../contexts/WorkerContext';
import { AppContext } from '../../contexts/AppContext';

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
    <div className="card">
      <span className="innerTitle">Particle Colors Gradient</span>
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          {particleColors.map((color, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#2a2a2a',
                padding: '4px',
                borderRadius: '4px'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: color,
                  marginRight: '5px',
                  border: '1px solid #888'
                }}
              />
              <span style={{ marginRight: '5px' }}>{color}</span>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="color"
            className="userInput"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
          />
          <button
            onClick={addColor}
            style={{
              background: '#333',
              border: '1px solid #666',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer'
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
          background: `linear-gradient(to right, ${particleColors.join(', ')})`
        }} />
      )}
    </div>
  );
};
