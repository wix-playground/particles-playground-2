import {useMemo} from 'react';

export const useImageLoader = ({
  width: _width,
  height: _height,
  text,
  textColor,
  font,
  fontLoaded,
  canvasScale,
}: {
  width: number;
  height: number;
  text: string;
  textColor: string;
  font: string;
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
    analysisContext.fillStyle = textColor;
    analysisContext.font = font;

    // Handle multiline text
    const lines = text.trim().split('\n');
    const fontSizeMatch = font.match(/(\d+)px/);
    const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1]) : 64;
    const lineHeightPx = fontSize * 1.2; // Use default line height
    const totalTextHeight = (lines.length - 1) * lineHeightPx;

    lines.forEach((line, i) => {
      const yPosition = height / 2 + (-totalTextHeight / 2 + i * lineHeightPx);
      analysisContext.fillText(line, width / 2, yPosition);
    });

    // Analyze image data without affecting main canvas
    return analysisCanvas.transferToImageBitmap();
  }, [width, height, text, textColor, font, fontLoaded, canvasScale]);

  return imageData;
};
