import {useMemo} from 'react';
import {Dimensions} from '../interfaces';
import {
  DEFAULT_DARK_THEME_COLOR,
  DEFAULT_LIGHT_THEME_COLOR,
} from '../constants';

export const useImageLoader = ({
  dimensions,
  text,
}: {
  dimensions: Dimensions;
  text: string;
}) => {
  const imageData = useMemo(() => {
    const {height, width} = dimensions;
    if (!height && !width) {
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
    analysisContext.font = 'bold 90pt sans-serif';
    analysisContext.fillText(text, width / 2, height / 2);

    // Analyze image data without affecting main canvas
    return analysisCanvas.transferToImageBitmap();
  }, [dimensions, text]);

  return imageData;
};
