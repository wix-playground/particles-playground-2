import {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import {SNIPPET_QUERY_PARAM} from './constants';
import {editor} from 'monaco-editor';
import {Settings} from './components/Settings';
import {Action, AppProps, WorkerAction} from './interfaces';
import {useImageLoader} from './hooks/useImageLoader';
import {AppContext} from './contexts/AppContext';
import {WorkerContext} from './contexts/WorkerContext';
import {Editor} from './components/Editor/Editor';
import {loadJsonFromSnippet} from './snippet';

// TODO: Maybe some tests too, even if it's just a playground.
const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const canvasInitialized = useRef<boolean>(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [appProps, setAppProps] = useState<AppProps | null>(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const {width, height} = canvasRef.current.getBoundingClientRect();
        setDimensions({width, height});
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const bitmap = useImageLoader({
    dimensions: dimensions,
    text: 'WIX',
  });

  useEffect(() => {
    // Create the Web Worker
    workerRef.current = new Worker(new URL('./worker', import.meta.url), {
      type: 'module',
    });

    workerRef.current.addEventListener('message', ({data}) => {
      if (data.type === WorkerAction.UPDATE_APP_PROPS) {
        // console.log('UPDATE_APP_PROPS', data.data);
        setAppProps(data.data);
      }
      if (data.type === WorkerAction.INITIALIZED) {
        // console.log('INITIALIZED', data.data);
        canvasInitialized.current = true;
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
    const initializeWorker = async () => {
      const canvas = canvasRef.current;
      if (!canvasInitialized.current && canvas && bitmap) {
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const transferrableCanvas = canvas.transferControlToOffscreen();
        const urlParams = new URLSearchParams(window.location.search);
        const snippetId = urlParams.get(SNIPPET_QUERY_PARAM);
        let snippetData: AppProps | null = null;

        if (snippetId) {
          snippetData = await loadJsonFromSnippet();
        }

        workerRef.current?.postMessage(
          {
            type: Action.INITIALIZE,
            data: {
              canvas: transferrableCanvas,
              dimensions: {width: canvas.width, height: canvas.height},
              imageBitmap: bitmap!,
              ...(snippetData ? snippetData : {}),
            },
          },
          [transferrableCanvas, bitmap!]
        );
      } else if (bitmap && canvasInitialized) {
        workerRef.current?.postMessage(
          {type: Action.UPDATE_BITMAP, data: bitmap},
          [bitmap]
        );
      }
    };
    initializeWorker();
  }, [bitmap]);

  const handleEditorDidMount = useCallback(
    async (editor: editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
    },
    []
  );

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
                <div
                  className="card noPadding"
                  style={{width: '100%', height: '100%'}}
                >
                  <canvas
                    ref={canvasRef}
                    style={{width: '100%', height: '100%'}}
                  />
                </div>
              </div>
            </div>
            <Editor onMount={handleEditorDidMount} />
          </div>
        </div>
      </WorkerContext.Provider>
    </AppContext.Provider>
  );
};

export default App;
