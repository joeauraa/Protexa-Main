export class AudioDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private isListening = false;
  private animationId: number | null = null;

  async initialize(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(stream);

      this.analyser.fftSize = 2048;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      this.microphone.connect(this.analyser);
      return true;
    } catch (error) {
      console.error('Microphone access denied:', error);
      return false;
    }
  }

  startListening(onClapDetected: () => void, onWhistleDetected: () => void) {
    if (!this.analyser || !this.dataArray) return;

    this.isListening = true;
    let clapThreshold = 200;
    let whistleFrequencyRange = { min: 50, max: 100 };

    const detect = () => {
      if (!this.isListening || !this.analyser || !this.dataArray) return;

      this.analyser.getByteFrequencyData(this.dataArray);

      const average = this.dataArray.reduce((a, b) => a + b) / this.dataArray.length;
      const peak = Math.max(...this.dataArray);

      if (peak > clapThreshold && average > 80) {
        onClapDetected();
      }

      const whistleRange = this.dataArray.slice(whistleFrequencyRange.min, whistleFrequencyRange.max);
      const whistleAverage = whistleRange.reduce((a, b) => a + b) / whistleRange.length;

      if (whistleAverage > 150 && average < 100) {
        onWhistleDetected();
      }

      this.animationId = requestAnimationFrame(detect);
    };

    detect();
  }

  stopListening() {
    this.isListening = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  cleanup() {
    this.stopListening();
    if (this.microphone) {
      this.microphone.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
