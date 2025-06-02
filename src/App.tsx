import FontFaceObserver from 'fontfaceobserver';
import {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import {DEFAULT_FONT_STATE, SNIPPET_QUERY_PARAM} from './constants';
import {
  AppProps,
  getInitializeMessage,
  getPlayMessage,
  getResetMessage,
  getUpdateBitmapMessage,
  WorkerAction,
} from './interfaces';
import {useImageLoader} from './hooks/useImageLoader';
import {AppContext} from './contexts/AppContext';
import {WorkerContext} from './contexts/WorkerContext';
import {loadJsonFromSnippet} from './snippet';
import {getFontString} from './utils';
import {EffectControls} from './components/EffectControls';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const canvasInitialized = useRef<boolean>(false);
  const [appProps, setAppProps] = useState<AppProps | null>(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (appProps?.font.fontFamily && appProps.font.weight) {
      const font = new FontFaceObserver(appProps.font.fontFamily, {
        weight: appProps.font.weight,
        style: appProps.font.italic ? 'italic' : undefined,
      });
      setFontLoaded(false);
      font.load().then(
        () => {
          setFontLoaded(true);
        },
        () => {
          setFontLoaded(false);
        }
      );
    }
  }, [appProps?.font]);

  const bitmap = useImageLoader({
    dimensions,
    text: appProps?.text ?? '',
    font: getFontString(appProps?.font ?? DEFAULT_FONT_STATE),
    letterSpacing: appProps?.font ? appProps.font.letterSpacing : 0,
    fontLoaded,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const {width, height} = canvasRef.current.getBoundingClientRect();
        setDimensions({width, height});
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [appProps]);

  useEffect(() => {
    // Create the Web Worker
    workerRef.current = new Worker(new URL('./worker', import.meta.url), {
      type: 'module',
    });

    workerRef.current.addEventListener('message', ({data}) => {
      if (data.type === WorkerAction.UPDATE_APP_PROPS) {
        setAppProps(data.data);
      }
      if (data.type === WorkerAction.INITIALIZED) {
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
          getInitializeMessage({
            canvas: transferrableCanvas,
            dimensions: {width: bitmap.width, height: bitmap.height},
            imageBitmap: bitmap!,
            appProps: snippetData ?? ({} as AppProps),
          }),
          [transferrableCanvas, bitmap!]
        );
      } else if (bitmap && canvasInitialized) {
        workerRef.current?.postMessage(getUpdateBitmapMessage(bitmap), [
          bitmap,
        ]);
      }
    };
    initializeWorker();
  }, [bitmap]);

  const play = useCallback(() => {
    workerRef.current?.postMessage(getPlayMessage());
  }, []);

  const reset = useCallback(() => {
    workerRef.current?.postMessage(getResetMessage());
  }, []);

  return (
    <AppContext.Provider value={appProps}>
      <WorkerContext.Provider value={workerRef.current}>
        {!appProps ? (
          <div className="loadingContainer">
            <span>Loading...</span>
          </div>
        ) : null}

        <EffectControls onPlay={play} onReset={reset} />

        <canvas
          ref={canvasRef}
          id="mainCanvas"
          style={{
            border: '1px solid #4A5568',
            backgroundColor: '#1F2937',
            borderRadius: '12px',
            marginTop: '20px',
            width: '100%',
            maxWidth: '1000px',
            height: '600px'
          }}
        />
      </WorkerContext.Provider>
    </AppContext.Provider>
  );
};

export default App;
