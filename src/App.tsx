import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import Editor from '@monaco-editor/react';
import {
  CANVAS_DIMENSIONS,
  DEFAULT_MOVEMENT_FUNCTION_KEY,
  DEFAULT_PARTICLE_RADIUS,
  DEFAULT_START_POSITION,
  EXAMPLE_CODE,
} from './constants';
import {editor} from 'monaco-editor';
import {Settings} from './components/Settings';
import {getPredefinedMovementOptions} from './movement';
import {Action} from './interfaces';
import {CopyPromptButton} from './components/CopyPromptButton';
import {useImageLoader} from './useImageLoader';

// TODO: architecture overhaul where app receives state from worker and all messages are send and handled in a redux store like way.
// TODO: Maybe some tests too, even if it's just a playground.
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null);
  const offscreenContextRef = useRef<OffscreenCanvasRenderingContext2D | null>(
    null
  );
  const workerRef = useRef<Worker | null>(null);
  const canvasInitialized = useRef<boolean>(false);
  const particlesReachedTarget = useRef<boolean>(false);
  const [code, setCode] = useState<string>(EXAMPLE_CODE);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selectedMovementFunction, setSelectedMovementFunction] =
    useState<string>(DEFAULT_MOVEMENT_FUNCTION_KEY);

  const bitmap = useImageLoader({
    dimensions: CANVAS_DIMENSIONS,
    text: 'WIX',
  });

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

  useEffect(() => {
    offscreenCanvasRef.current = new OffscreenCanvas(
      CANVAS_DIMENSIONS.width,
      CANVAS_DIMENSIONS.height
    );
    offscreenContextRef.current = offscreenCanvasRef.current.getContext('2d', {
      willReadFrequently: true,
    });
  }, []);

  const predefinedMovementFunctions = useMemo(
    () => getPredefinedMovementOptions(),
    []
  );

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const movementFunctionEntries = Object.entries(
        predefinedMovementFunctions
      );

      const predefinedFunctionEntry = movementFunctionEntries.find((entry) => {
        const [, code] = entry;
        return code === value;
      });

      if (predefinedFunctionEntry) {
        const [key] = predefinedFunctionEntry;
        setSelectedMovementFunction(key);
      }

      if (value) {
        setCode(value);
      } else {
        setCode('');
      }
    },
    [predefinedMovementFunctions]
  );

  const handleEditorDidMount = async (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    const canvas = canvasRef.current;

    if (!canvas || !bitmap) {
      console.error('Animation components not fully initialized');
      setLoadError(true);
      return;
    }

    if (!canvasInitialized.current) {
      const transferrableCanvas = canvas.transferControlToOffscreen();
      workerRef.current?.postMessage(
        {
          type: Action.INITIALIZE,
          data: {
            canvas: transferrableCanvas,
            dimensions: {width: canvas.width, height: canvas.height},
            imageBitmap: bitmap!,
            particleRadius: DEFAULT_PARTICLE_RADIUS,
            startPosition: DEFAULT_START_POSITION,
          },
        },
        [transferrableCanvas, bitmap!]
      );
    }
  };

  const play = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }

    workerRef.current?.postMessage({
      type: Action.PLAY,
      data: {
        code: editorRef.current?.getValue(),
      },
    });
  }, []);

  const reset = useCallback(() => {
    workerRef.current?.postMessage({type: Action.RESET});
  }, []);

  const handleResetCode = () => {
    setSelectedMovementFunction(DEFAULT_MOVEMENT_FUNCTION_KEY);
    setCode(EXAMPLE_CODE);
  };

  return (
    <div style={{display: 'flex', gap: '24px', flexDirection: 'column'}}>
      {loadError && (
        <div
          className="card"
          style={{backgroundColor: '#FFAAAA', color: '#4a0b0b'}}
        >
          Load error, refresh the page
          <button
            onClick={() => {
              window.location.reload();
            }}
          >
            Refresh
          </button>
        </div>
      )}
      <div
        className="layout"
        style={{display: 'flex', flexDirection: 'column'}}
      >
        <h1>Particles playground v0.2</h1>
        <div
          style={{display: 'flex', justifyContent: 'space-between', gap: '8px'}}
        >
          <Settings
            workerRef={workerRef}
            editorRef={editorRef}
            setSelectedMovementFunction={setSelectedMovementFunction}
            selectedMovementFunction={selectedMovementFunction}
          />
          <div className="card" style={{width: '70%'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <div>
                <span className="cardTitle">Canvas</span>
              </div>
              <div style={{display: 'flex', gap: '4px'}}>
                <button onClick={play}>Play animation</button>
                <button onClick={reset}>Reset particles</button>
              </div>
            </div>
            <div className="card noPadding">
              <canvas
                ref={canvasRef}
                width={CANVAS_DIMENSIONS.width}
                height={CANVAS_DIMENSIONS.height}
              />
            </div>
          </div>
        </div>
        <div
          className="card layout editorContainer"
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <span className="cardTitle">Movement function editor</span>
            <div style={{display: 'flex', gap: '4px'}}>
              <CopyPromptButton />
              <button
                disabled={code === EXAMPLE_CODE}
                onClick={handleResetCode}
              >
                Reset code to example
              </button>
            </div>
          </div>
          <Editor
            onMount={handleEditorDidMount}
            height="40vh"
            defaultLanguage="javascript"
            value={code}
            onChange={handleEditorChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
