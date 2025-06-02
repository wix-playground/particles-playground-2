import {useMemo} from 'react';
import {Dimensions} from '../interfaces';
import {
  DEFAULT_DARK_THEME_COLOR,
  DEFAULT_LIGHT_THEME_COLOR,
} from '../constants';

export const useImageLoader = ({
  width,
  height,
  text,
  font,
  letterSpacing,
  fontLoaded,
}: {
  width: number;
  height: number;
  text: string;
  font: string;
  letterSpacing: number;
  fontLoaded: boolean;
}) => {
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
    analysisContext.fillText(text, width / 2, height / 2);

    // Analyze image data without affecting main canvas
    return analysisCanvas.transferToImageBitmap();
  }, [width, height, text, font, letterSpacing, fontLoaded]);

  return imageData;
};
