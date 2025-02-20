import {useEffect, useRef, useState} from 'react';
import './App.css';
import Editor from '@monaco-editor/react';
import {DEFAULT_PARTICLE_RADIUS, EXAMPLE_CODE} from './constants';
import {editor} from 'monaco-editor';
import {Settings} from './components/Settings';

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
  const [code, setCode] = useState<string>(EXAMPLE_CODE);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [loadError, setLoadError] = useState(false);
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
  useEffect(() => {
    offscreenCanvasRef.current = new OffscreenCanvas(300, 150);
    offscreenContextRef.current = offscreenCanvasRef.current.getContext('2d', {
      willReadFrequently: true,
    });
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    setSelectedMovementFunction(null);
    if (value) {
      setCode(value);
    } else {
      setCode('');
    }
  };

  const handleEditorDidMount = async (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    const canvas = canvasRef.current;

    offscreenContextRef.current!.drawImage(
      imageRef.current!,
      0,
      0,
      imageRef.current!.width,
      imageRef.current!.height
    );

    // TODO: hack-ish, do proper image loading for next stage
    await createImageBitmap(
      offscreenContextRef.current!.getImageData(
        0,
        0,
        imageRef.current!.width,
        imageRef.current!.height
      )
    ).then((bitmap) => {
      imageBitmap.current = bitmap;
    });

    if (!canvas || !imageBitmap.current) {
      console.error('Animation components not fully initialized');
      setLoadError(true);
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
            particleRadius: DEFAULT_PARTICLE_RADIUS,
          },
        },
        [transferrableCanvas, imageBitmap.current!]
      );
      imageBitmap.current.close();
    }
  };

  const handleResetCode = () => {
    setSelectedMovementFunction(null);
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
        <h1>Particles playground v0.1</h1>
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
        />
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Settings
            workerRef={workerRef}
            editorRef={editorRef}
            setSelectedMovementFunction={setSelectedMovementFunction}
            selectedMovementFunction={selectedMovementFunction}
          />
          <div className="card">
            <span className="cardTitle">Canvas</span>
            <div className="card noPadding">
              <canvas
                ref={canvasRef}
                width={300}
                height={150}
                style={{width: '300px', height: '150px'}}
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
            <button disabled={code === EXAMPLE_CODE} onClick={handleResetCode}>
              Reset code to example
            </button>
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
