export class MotionDetector {
  private isListening = false;
  private lastAcceleration = { x: 0, y: 0, z: 0 };
  private motionThreshold = 15;

  startListening(onMotionDetected: () => void) {
    if (typeof DeviceMotionEvent === 'undefined') {
      console.warn('Motion detection not supported');
      return false;
    }

    this.isListening = true;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (!this.isListening) return;

      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const x = acceleration.x || 0;
      const y = acceleration.y || 0;
      const z = acceleration.z || 0;

      const deltaX = Math.abs(x - this.lastAcceleration.x);
      const deltaY = Math.abs(y - this.lastAcceleration.y);
      const deltaZ = Math.abs(z - this.lastAcceleration.z);

      const totalDelta = deltaX + deltaY + deltaZ;

      if (totalDelta > this.motionThreshold) {
        onMotionDetected();
      }

      this.lastAcceleration = { x, y, z };
    };

    window.addEventListener('devicemotion', handleMotion);
    return true;
  }

  stopListening() {
    this.isListening = false;
    window.removeEventListener('devicemotion', () => {});
  }
}
