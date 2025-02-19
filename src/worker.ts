import {Particle} from './interfaces';
import {getRandomInt, getValidImageBlocks} from './utils';

let workerParticles: Particle[] = [];
let imageBitmap: ImageBitmap;

let animationFrameId: number;

let frameCanvas: OffscreenCanvas;
let frameContext: OffscreenCanvasRenderingContext2D;

let mainCanvas: OffscreenCanvas;
let mainContext: ImageBitmapRenderingContext;

let particleRadius: number;

let customMovementFunction: (particle: Particle) => void;

const initializeCanvas = async (canvas: OffscreenCanvas) => {
  mainCanvas = canvas;
  mainContext = mainCanvas.getContext(
    'bitmaprenderer'
  ) as ImageBitmapRenderingContext;

  frameCanvas = new OffscreenCanvas(mainCanvas.width, mainCanvas.height);
  frameContext = frameCanvas.getContext('2d', {
    willReadFrequently: true,
  })! as OffscreenCanvasRenderingContext2D;
};

const initialize = async (data: any) => {
  const {
    imageBitmap: _imageBitmap,
    canvas,
    dimensions,
    particleRadius: _particleRadius,
  } = data;
  imageBitmap = _imageBitmap;
  particleRadius = _particleRadius;
  initializeCanvas(canvas);
  frameContext.drawImage(imageBitmap, 0, 0);
  const {validBlocks, blockHeight, blockWidth} = getValidImageBlocks(
    frameContext.getImageData(0, 0, mainCanvas.width, mainCanvas.height),
    particleRadius
  );
  workerParticles = generateParticles({
    validBlocks,
    dimensions,
    radius: particleRadius,
    blockHeight,
    blockWidth,
  });
};

const renderParticles = () => {
  let particlesReachedTarget = true;
  frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height);

  workerParticles.forEach((particle) => {
    // Update particles position by calling your movement function here:
    customMovementFunction(particle);

    // Draw particle on frame context
    frameContext.drawImage(
      imageBitmap,
      particle.targetX,
      particle.targetY,
      particleRadius,
      particleRadius,
      Math.floor(particle.x),
      Math.floor(particle.y),
      particleRadius,
      particleRadius
    );

    if (particle.x !== particle.targetX || particle.y !== particle.targetY) {
      particlesReachedTarget = false;
    }
  });

  const frameBitmap = frameCanvas.transferToImageBitmap();
  mainContext.transferFromImageBitmap(frameBitmap);

  if (particlesReachedTarget) {
    self.postMessage({type: 'particlesReachedTarget'});

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  } else {
    animationFrameId = requestAnimationFrame(renderParticles);
  }
};

self.onmessage = (event) => {
  const {data, type} = event.data;
  switch (type) {
    case 'initialize': {
      initialize(data);
      self.postMessage({type: 'initialized'});
      break;
    }
    case 'resizeParticleRadius': {
      particleRadius = data.particleRadius;
      frameContext.drawImage(imageBitmap, 0, 0);
      const {validBlocks, blockHeight, blockWidth} = getValidImageBlocks(
        frameContext.getImageData(0, 0, mainCanvas.width, mainCanvas.height),
        particleRadius
      );

      workerParticles = generateParticles({
        validBlocks,
        dimensions: {width: mainCanvas.width, height: mainCanvas.height},
        radius: particleRadius,
        blockHeight,
        blockWidth,
      });
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        renderParticles();
      }
      break;
    }
    case 'play': {
      customMovementFunction = new Function(data.code)();
      renderParticles();
      break;
    }
    case 'reset': {
      workerParticles.forEach((particle) => {
        particle.x = getRandomInt(0, mainCanvas.width);
        particle.y = getRandomInt(0, mainCanvas.height);
      });

      frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
      const frameBitmap = frameCanvas.transferToImageBitmap();
      mainContext.transferFromImageBitmap(frameBitmap);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      break;
    }
    default:
      break;
  }
};

const generateParticles = ({
  validBlocks,
  dimensions,
  radius,
  blockHeight,
  blockWidth,
}: {
  validBlocks: Uint8Array<ArrayBuffer>;
  dimensions: {width: number; height: number};
  radius: number;
  blockHeight: number;
  blockWidth: number;
}) => {
  const particles: Array<Particle> = [];
  const {width, height} = dimensions;

  for (let blockY = 0; blockY < blockHeight; blockY++) {
    for (let blockX = 0; blockX < blockWidth; blockX++) {
      const index = blockY * blockWidth + blockX;
      if (validBlocks[index]) {
        const x = blockX * radius;
        const y = blockY * radius;

        const initialX = getRandomInt(0, width);
        const initialY = getRandomInt(0, height);
        particles.push({
          targetX: x,
          targetY: y,
          x: initialX,
          y: initialY,
          initialX,
          initialY,
        });
      }
    }
  }

  console.log('Particles amount: ', particles.length);
  return particles;
};
