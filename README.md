# Particles playground
This is a minimal viable product for particles effect with the architecture of communication between main thread and dedicated worker implemented.
## How to update particle movement
To change how the particles move: add a new movement function in `src/movement.ts` `movementConfig`.
Feel free to update the Particle interface in `src/interfaces.ts` to add extra properties for new movement functions or to update how particles are drawn in `src/worker.ts` `renderParticles`.
