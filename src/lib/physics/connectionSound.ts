export class ConnectionSound {
  enabled = true;
  private context: AudioContext | null = null;

  play(connected: boolean) {
    if (!this.enabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.context ??= new AudioCtx();
      void this.context.resume();
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = "sine";
      const t = this.context.currentTime;
      oscillator.frequency.setValueAtTime(connected ? 440 : 270, t);
      oscillator.frequency.exponentialRampToValueAtTime(
        connected ? 660 : 150,
        t + 0.13
      );
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.09, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      oscillator.connect(gain);
      gain.connect(this.context.destination);
      oscillator.start(t);
      oscillator.stop(t + 0.22);
    } catch {
      /* Sound is optional when browser audio is unavailable. */
    }
  }

  dispose() {
    try {
      void this.context?.close();
    } catch {}
    this.context = null;
  }
}
