import {
  Coordinates,
  Dimensions,
  FontState,
  StartPositionType,
} from './interfaces';

export const getValidImageBlocks = (
  imageData: ImageData,
  particleSize: number
) => {
  const OPACITY_THRESHOLD = 10;
  const {width, height, data} = imageData;
  const blockWidth = Math.ceil(width / particleSize);
  const blockHeight = Math.ceil(height / particleSize);
  const validBlocks = new Uint8Array(
    Math.ceil(width / particleSize) * Math.ceil(height / particleSize)
  );

  let index = 0;

  for (let y = 0; y < height; y += particleSize) {
    for (let x = 0; x < width; x += particleSize) {
      let isValid = false;
      for (let dy = 0; dy < particleSize && !isValid; dy++) {
        for (let dx = 0; dx < particleSize && !isValid; dx++) {
          const srcX = x + dx;
          const srcY = y + dy;
          if (srcX < width && srcY < height) {
            const srcIndex = (srcY * width + srcX) * 4;
            if (data[srcIndex + 3] > OPACITY_THRESHOLD) {
              isValid = true;
            }
          }
        }
      }
      validBlocks[index++] = isValid ? 1 : 0;
    }
  }
  return {validBlocks, blockWidth, blockHeight};
};

export const lerp = (start: number, end: number, t: number) =>
  start + t * (end - start);

// Convert hex color to RGB
export const hexToRgb = (hex: string): {r: number, g: number, b: number} => {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return {r, g, b};
};

// Convert HSL color to RGB
export const hslToRgb = (hslString: string): {r: number, g: number, b: number} => {
  // Parse HSL string like "hsl(120, 75%, 60%)"
  const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) {
    console.warn('Invalid HSL color format:', hslString);
    return {r: 0, g: 0, b: 0};
  }

  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

// Parse color string (supports both hex and HSL)
export const parseColor = (colorString: string): {r: number, g: number, b: number} => {
  // Handle undefined or null colorString
  if (!colorString || typeof colorString !== 'string') {
    throw new Error(`Invalid color string provided to parseColor: ${JSON.stringify(colorString)}`);
  }

  if (colorString.startsWith('hsl(')) {
    return hslToRgb(colorString);
  } else {
    return hexToRgb(colorString);
  }
};

// Convert RGB to hex color
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Get color based on progress and array of colors
export const getColorFromProgress = (colors: string[], progress: number): string => {
  if (!colors?.length) return '#ffffff';

  // Filter out any undefined or invalid colors
  const validColors = colors.filter(color => color && typeof color === 'string');
  if (!validColors.length) {
    throw new Error(`Invalid colors provided to getColorFromProgress: ${JSON.stringify(colors)}`);
  }

  if (validColors.length === 1) return validColors[0];



  // Ensure progress is between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Calculate which segment of the gradient we're in
  const segment = clampedProgress * (validColors.length - 1);
  const segmentIndex = Math.floor(segment);

  // Handle edge case when progress is exactly 1
  if (segmentIndex === validColors.length - 1) {
    return validColors[validColors.length - 1];
  }

  // Calculate interpolation value within this segment (0-1)
  const segmentProgress = segment - segmentIndex;

  // Get the two colors to interpolate between - now supports both hex and HSL
  const color1 = parseColor(validColors[segmentIndex]);
  const color2 = parseColor(validColors[segmentIndex + 1]);

  // Interpolate RGB values
  const r = Math.round(lerp(color1.r, color2.r, segmentProgress));
  const g = Math.round(lerp(color1.g, color2.g, segmentProgress));
  const b = Math.round(lerp(color1.b, color2.b, segmentProgress));

  // Convert back to hex
  return rgbToHex(r, g, b);
};

export const calculateDistance = (point1: Coordinates, point2: Coordinates) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
};

export const getStartCoordinatesConfig = ({
  dimensions: {width, height},
  emitterX = width / 2,
  emitterY = height / 2,
  emitterSize = 100,
  emitterAngle = 0,
}: {
  dimensions: Dimensions;
  emitterX?: number;
  emitterY?: number;
  emitterSize?: number;
  emitterAngle?: number;
}): Record<StartPositionType, () => Coordinates> => {
  const config: Record<StartPositionType, () => Coordinates> = {
    top: () => ({
      x: Math.random() * width,
      y: 0,
    }),
    center: () => ({
      x: Math.round(width / 2),
      y: Math.round(height / 2),
    }),
    bottom: () => ({
      x: Math.random() * width,
      y: height,
    }),
    random: () => ({
      x: Math.random() * width,
      y: Math.random() * height,
    }),
    left: () => ({
      x: 0,
      y: Math.random() * height,
    }),
    right: () => ({
      x: width,
      y: Math.random() * height,
    }),
    'top-left': () => ({
      x: Math.random() * (width / 5),
      y: Math.random() * (height / 5),
    }),
    'top-right': () => ({x: width, y: Math.random() * (height / 5)}),
    'bottom-left': () => ({
      x: Math.random() * (width / 5),
      y: height - Math.random() * (height / 5),
    }),
    'bottom-right': () => ({
      x: width - Math.random() * (width / 5),
      y: height - Math.random() * (height / 5),
    }),
    canvasEdges: () => {
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) return {x: Math.random() * width, y: 0}; // top
      if (edge === 1) return {x: Math.random() * width, y: height}; // bottom
      if (edge === 2) return {x: 0, y: Math.random() * height}; // left
      return {x: width, y: Math.random() * height}; // right
    },
    topLeft: () => ({x: 0, y: 0}),
    emitterPoint: () => ({x: emitterX, y: emitterY}),
    emitterCircle: () => {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * emitterSize;
      return {
        x: emitterX + radius * Math.cos(angle),
        y: emitterY + radius * Math.sin(angle),
      };
    },
    emitterSquare: () => ({
      x: emitterX + (Math.random() - 0.5) * emitterSize,
      y: emitterY + (Math.random() - 0.5) * emitterSize,
    }),
    emitterHLine: () => {
      const angleRad = emitterAngle * (Math.PI / 180);
      const offsetX = (Math.random() - 0.5) * emitterSize;
      return {
        x: emitterX + offsetX * Math.cos(angleRad),
        y: emitterY + offsetX * Math.sin(angleRad),
      };
    },
    emitterVLine: () => {
      const angleRad = (emitterAngle + 90) * (Math.PI / 180); // Perpendicular to horizontal line
      const offsetY = (Math.random() - 0.5) * emitterSize;
      return {
        x: emitterX + offsetY * Math.cos(angleRad),
        y: emitterY + offsetY * Math.sin(angleRad),
      };
    },
    enterTopTextWidth: () => ({
      x: width * 0.2 + Math.random() * width * 0.6, // Rough text width estimate
      y: height * 0.3, // Rough text top estimate
    }),
    enterBottomTextWidth: () => ({
      x: width * 0.2 + Math.random() * width * 0.6,
      y: height * 0.7, // Rough text bottom estimate
    }),
    enterLeftTextHeight: () => ({
      x: width * 0.2, // Rough text left estimate
      y: height * 0.3 + Math.random() * height * 0.4,
    }),
    enterRightTextHeight: () => ({
      x: width * 0.8, // Rough text right estimate
      y: height * 0.3 + Math.random() * height * 0.4,
    }),
  };
  return config;
};

export const getFontString = (font: FontState) =>
  `${font.italic ? 'italic ' : ''}${font.weight} ${font.fontSize}px '${font.fontFamily
  }'`;
