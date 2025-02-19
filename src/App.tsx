import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import {getPredefinedMovementOptions} from './movement';
import Editor from '@monaco-editor/react';

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
  const [code, setCode] = useState<string>(`return (particle) => {
    /**
    * This function will be called on each requestAnimationFrame until the particle reaches target coordinates.
    * Write your movement animation code here to incrementally update particle position.
    * The particle is mutable here so you can add whatever properties you need to achieve your animation.
    */

    const DELTA = 1

    // To keep the example simple, particle coordinates are updated by DELTA until target coordinates are reached.
    const getUpdatedPosition = (currentPosition, targetPosition, delta) => {
        const distance = Math.abs(currentPosition - targetPosition)
        if (distance <= delta) {
            return targetPosition
        } else {
            return currentPosition < targetPosition ? currentPosition + delta : currentPosition - delta
        }
    }

    particle.x = getUpdatedPosition(particle.x, particle.targetX, DELTA)
    particle.y = getUpdatedPosition(particle.y, particle.targetY, DELTA)
}`);
  const editorRef = useRef(null);
  const [selectedMovementFunction, setSelectedMovementFunction] = useState<
    string | null
  >(null);

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

  const predefinedMovementOptions = useMemo(
    () => getPredefinedMovementOptions(),
    []
  );

  const movementOptionKeys = useMemo(() => {
    return Object.keys(predefinedMovementOptions);
  }, [predefinedMovementOptions]);

  useEffect(() => {
    offscreenCanvasRef.current = new OffscreenCanvas(300, 150);
    offscreenContextRef.current = offscreenCanvasRef.current.getContext('2d', {
      willReadFrequently: true,
    });
  }, []);

  const play = useCallback(() => {
    if (editorRef.current) {
      //@ts-expect-error
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
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
      data: {movement: selectedMovementFunction, code},
    });
  }, [selectedMovementFunction, code]);

  const reset = useCallback(() => {
    workerRef.current?.postMessage({type: 'reset'});
    particlesReachedTarget.current = false;
  }, []);

  const handleEditorChange = (value, event) => {
    setSelectedMovementFunction(null);
    setCode(value);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handlePredefinedMovementClick = (option: string) => {
    setSelectedMovementFunction(option);
    setCode(predefinedMovementOptions[option]);
  };

  return (
    <div style={{display: 'flex', gap: '24px', flexDirection: 'column'}}>
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
        <canvas
          ref={canvasRef}
          width={300}
          height={150}
          style={{width: '300px', height: '150px'}}
        />
        <button disabled={!isImageReady} onClick={play}>
          Play animation
        </button>
        <button onClick={reset}>Reset animation</button>
        <div>
          <div>
            Predefined movement functions:
            {movementOptionKeys.map((option) => (
              <button
                className={
                  selectedMovementFunction === option ? 'selected' : undefined
                }
                key={option}
                onClick={() => handlePredefinedMovementClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Editor
        onMount={handleEditorDidMount}
        height="40vh"
        width={'80vw'}
        defaultLanguage="javascript"
        value={code}
        onChange={handleEditorChange}
      />
    </div>
  );
}

export default App;
