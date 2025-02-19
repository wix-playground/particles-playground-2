export const PARTICLE_RADIUS = 2;

export const EXAMPLE_CODE = `return (particle) => {
    /**
    * This function will be called on each requestAnimationFrame until the particle reaches target coordinates.
    * Write your movement animation code here to incrementally update particle position.
    * The particle is mutable here so you can add whatever properties you need to achieve your animation.
    */

    const DELTA = 1

    // To keep the example simple, particle coordinates are updated by DELTA until target coordinates are reached.
    const getUpdatedPosition = (currentPosition, targetPosition, delta) => {
        const distance = Math.abs(currentPosition - targetPosition)
        if (distance <= delta) {
            return targetPosition
        } else {
            return currentPosition < targetPosition ? currentPosition + delta : currentPosition - delta
        }
    }

    particle.x = getUpdatedPosition(particle.x, particle.targetX, DELTA)
    particle.y = getUpdatedPosition(particle.y, particle.targetY, DELTA)
}`;
