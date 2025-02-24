import {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import {
  CANVAS_DIMENSIONS,
  DEFAULT_PARTICLE_RADIUS,
  DEFAULT_START_POSITION,
} from './constants';
import {editor} from 'monaco-editor';
import {Settings} from './components/Settings';
import {Action, AppProps, WorkerAction} from './interfaces';
import {useImageLoader} from './hooks/useImageLoader';
import {AppContext} from './contexts/AppContext';
import {WorkerContext} from './contexts/WorkerContext';
import {Editor} from './components/Editor/Editor';

// TODO: Maybe some tests too, even if it's just a playground.
const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null);
  const offscreenContextRef = useRef<OffscreenCanvasRenderingContext2D | null>(
    null
  );
  const workerRef = useRef<Worker | null>(null);
  const canvasInitialized = useRef<boolean>(false);
  const particlesReachedTarget = useRef<boolean>(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [appProps, setAppProps] = useState<AppProps | null>(null);

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

      if (data.type === WorkerAction.UPDATE_APP_PROPS) {
        // console.log('UPDATE_APP_PROPS', data.data);
        setAppProps(data.data);
      }
      if (data.type === WorkerAction.INITIALIZED) {
        // console.log('INITIALIZED');
        setAppProps(data.data);
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
    });
  }, []);

  const reset = useCallback(() => {
    workerRef.current?.postMessage({type: Action.RESET});
  }, []);

  return (
    <AppContext.Provider value={appProps}>
      <WorkerContext.Provider value={workerRef.current}>
        {!appProps ? (
          <div className="loadingContainer">
            <span>Loading...</span>
          </div>
        ) : null}
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
            <h1>Particles playground v0.3</h1>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <Settings />
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
            <Editor handleEditorDidMount={handleEditorDidMount} />
          </div>
        </div>
      </WorkerContext.Provider>
    </AppContext.Provider>
  );
};

export default App;
