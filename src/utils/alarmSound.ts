export class AlarmSound {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  play() {
    if (this.isPlaying) return;

    this.audioContext = new AudioContext();
    this.oscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.oscillator.type = 'square';
    this.oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    this.gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);

    let time = this.audioContext.currentTime;
    for (let i = 0; i < 10; i++) {
      this.oscillator.frequency.setValueAtTime(800, time);
      this.oscillator.frequency.setValueAtTime(1000, time + 0.1);
      time += 0.2;
    }

    this.oscillator.start();
    this.isPlaying = true;

    setTimeout(() => {
      this.stop();
    }, 3000);
  }

  stop() {
    if (!this.isPlaying) return;

    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }

    this.isPlaying = false;
  }
}
