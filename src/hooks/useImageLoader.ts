import {useMemo} from 'react';
import {
  DEFAULT_DARK_THEME_COLOR,
  DEFAULT_LIGHT_THEME_COLOR,
} from '../constants';

export const useImageLoader = ({
  width: _width,
  height: _height,
  text,
  font,
  letterSpacing,
  fontLoaded,
  canvasScale,
}: {
  width: number;
  height: number;
  text: string;
  font: string;
  letterSpacing: number;
  fontLoaded: boolean;
  canvasScale: number;
}) => {
  const width = _width * canvasScale;
  const height = _height * canvasScale;
  const imageData = useMemo(() => {
    if (!height && !width && !fontLoaded) {
      return null;
    }

    const analysisCanvas = new OffscreenCanvas(width, height);

    const analysisContext = analysisCanvas.getContext('2d', {
      willReadFrequently: true,
    }) as OffscreenCanvasRenderingContext2D;

    if (!analysisContext) {
      return;
    }

    analysisContext.textAlign = 'center';
    analysisContext.textBaseline = 'middle';
    analysisContext.fillStyle =
      window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
        ? DEFAULT_DARK_THEME_COLOR
        : DEFAULT_LIGHT_THEME_COLOR;
    analysisContext.font = font;
    analysisContext.letterSpacing = `${letterSpacing}rem`;
    analysisContext.fillText(text.trim(), width / 2, height / 2);

    // Analyze image data without affecting main canvas
    return analysisCanvas.transferToImageBitmap();
  }, [width, height, text, font, letterSpacing, fontLoaded, canvasScale]);

  return imageData;
};
