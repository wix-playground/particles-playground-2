# Particles playground
This is a minimal viable product for particles effect with the architecture of communication between main thread and dedicated worker implemented.

## Features
- **Particle Text Animation**: Text is rendered as particles that animate from various starting positions to form the final text
- **Selectable Text**: After the particle animation completes, an invisible text overlay appears that allows users to select and copy the text
- **Custom Movement Functions**: Define how particles move during animation
- **Font Customization**: Adjust font family, size, weight, style, and letter spacing
- **Multiple Start Positions**: Choose from various starting positions for particles (random, center, edges, etc.)
- **Particle Customization**: Modify particle colors, radius, and animation duration
- **Bubble Effects**: Optional bubble particles that appear when the main animation completes

## How to update particle movement
To change how the particles move: add a new movement function in `src/movement.ts` `movementConfig`.
Feel free to update the Particle interface in `src/interfaces.ts` to add extra properties for new movement functions or to update how particles are drawn in `src/worker.ts` `renderParticles`.

## Selectable Text Feature
When the particle animation completes, a transparent text overlay appears over the canvas that:
- Uses the same font settings as the particle text
- Allows text selection and copying
- Maintains the exact positioning and styling of the original text
- Automatically appears/disappears based on animation state
- Supports multi-line text with proper spacing
