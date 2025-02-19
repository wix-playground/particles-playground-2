import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import {movementConfig} from './movement';

function App() {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null);
  const offscreenContextRef = useRef<OffscreenCanvasRenderingContext2D | null>(
    null
  );
  const imageBitmap = useRef<ImageBitmap | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const canvasInitialized = useRef<boolean>(false);
  const particlesReachedTarget = useRef<boolean>(false);
  const [isImageReady, setIsImageReady] = useState(false);
  const [selectedMovementFunction, setSelectedMovementFunction] =
    useState('linear');

  useEffect(() => {
    // Create the Web Worker
    workerRef.current = new Worker(new URL('./worker', import.meta.url), {
      type: 'module',
    });

    workerRef.current.addEventListener('message', ({data}) => {
      if (data.type === 'particlesReachedTarget') {
        particlesReachedTarget.current = true;
      }

      if (data.type === 'initialized') {
        canvasInitialized.current = true;
      }
    });

    return () => {
      // Terminate the worker when the component unmounts
      workerRef.current?.terminate();
      canvasInitialized.current = false;
    };
  }, []);

  const movementOptions = useMemo(() => {
    return Object.keys(movementConfig);
  }, []);

  useEffect(() => {
    offscreenCanvasRef.current = new OffscreenCanvas(300, 150);
    offscreenContextRef.current = offscreenCanvasRef.current.getContext('2d', {
      willReadFrequently: true,
    });
  }, []);

  const play = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas || !imageBitmap.current) {
      console.error('Animation components not fully initialized');
      return;
    }

    if (!canvasInitialized.current) {
      const transferrableCanvas = canvas.transferControlToOffscreen();
      workerRef.current?.postMessage(
        {
          type: 'initialize',
          data: {
            canvas: transferrableCanvas,
            dimensions: {width: canvas.width, height: canvas.height},
            imageBitmap: imageBitmap.current,
          },
        },
        [transferrableCanvas, imageBitmap.current!]
      );
      imageBitmap.current.close();
    }

    workerRef.current?.postMessage({
      type: 'play',
      data: {movement: selectedMovementFunction},
    });
  }, [selectedMovementFunction]);

  const reset = useCallback(() => {
    workerRef.current?.postMessage({type: 'reset'});
    particlesReachedTarget.current = false;
  }, []);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <h1>Particles playground</h1>
      {/* We need an image source for creating ImageBitmap, this hidden image is for that. */}
      <img
        style={{display: 'none'}}
        ref={imageRef}
        crossOrigin="anonymous"
        src={
          'https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg'
        }
        className="logo"
        alt="Vite logo"
        height="100px"
        width="100px"
        onLoad={() => {
          setTimeout(() => {
            offscreenContextRef.current!.drawImage(
              imageRef.current!,
              0,
              0,
              imageRef.current!.width,
              imageRef.current!.height
            );

            createImageBitmap(
              offscreenContextRef.current!.getImageData(
                0,
                0,
                imageRef.current!.width,
                imageRef.current!.height
              )
            ).then((bitmap) => {
              imageBitmap.current = bitmap;
              setIsImageReady(true);
            });
          }, 100);
        }}
      />
      <canvas ref={canvasRef} />
      <button disabled={!isImageReady} onClick={play}>
        Play
      </button>
      <button onClick={reset}>Reset</button>
      <div>
        {movementOptions.map((option) => (
          <button
            className={
              selectedMovementFunction === option ? 'selected' : undefined
            }
            key={option}
            onClick={() => setSelectedMovementFunction(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
