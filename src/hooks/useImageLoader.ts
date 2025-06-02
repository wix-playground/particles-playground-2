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
  lineHeight,
}: {
  width: number;
  height: number;
  text: string;
  font: string;
  letterSpacing: number;
  fontLoaded: boolean;
  canvasScale: number;
  lineHeight: number;
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

    // Handle multiline text
    const lines = text.trim().split('\n');
    const fontSizeMatch = font.match(/(\d+)px/);
    const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1]) : 64;
    const lineHeightPx = fontSize * lineHeight;
    const totalTextHeight = (lines.length - 1) * lineHeightPx;

    lines.forEach((line, i) => {
      const yPosition = height / 2 + (-totalTextHeight / 2 + i * lineHeightPx);
      analysisContext.fillText(line, width / 2, yPosition);
    });

    // Analyze image data without affecting main canvas
    return analysisCanvas.transferToImageBitmap();
  }, [width, height, text, font, letterSpacing, fontLoaded, canvasScale, lineHeight]);

  return imageData;
};
