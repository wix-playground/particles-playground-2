import {useState, useCallback} from 'react';

export const Settings = ({
  workerRef,
}: {
  workerRef: React.RefObject<Worker | null>;
}) => {
  const [particleRadius, setParticleRadius] = useState<number>(2);
  const resizeParticleRadius = useCallback((radius: number) => {
    workerRef.current?.postMessage({
      type: 'resizeParticleRadius',
      data: {particleRadius: Number(radius)},
    });
  }, []);

  return (
    <div>
      <div>
        Particle radius:
        <input
          value={particleRadius}
          type="number"
          onChange={(e) => {
            const numberValue = Number(e.target.value);
            if (!Number.isNaN(numberValue) && numberValue > 0) {
              setParticleRadius(e.target.value as unknown as number);
              resizeParticleRadius(e.target.value as unknown as number);
            }
          }}
        />
      </div>
    </div>
  );
};
