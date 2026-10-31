export class RetroAudioService {
	private ctx: AudioContext | null = null;
	private muted = false;

	private getContext(): AudioContext | null {
		if (typeof window === 'undefined') return null;
		if (!this.ctx) {
			const AudioCtx =
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			this.ctx = new AudioCtx();
		}
		if (this.ctx.state === 'suspended') {
			this.ctx.resume();
		}
		return this.ctx;
	}

	public playCoin() {
		if (this.muted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'square';
		osc.frequency.setValueAtTime(987.77, now);
		osc.frequency.setValueAtTime(1318.51, now + 0.08);

		gain.gain.setValueAtTime(0.18, now);
		gain.gain.setValueAtTime(0.18, now + 0.08);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now);
		osc.stop(now + 0.38);
	}

	public playPowerUp() {
		if (this.muted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const notes = [330, 392, 659, 523, 587, 784, 880];
		const noteDuration = 0.045;
		const now = ctx.currentTime;

		notes.forEach((freq, idx) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = 'square';
			osc.frequency.setValueAtTime(freq, now + idx * noteDuration);

			gain.gain.setValueAtTime(0.14, now + idx * noteDuration);
			gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * noteDuration);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start(now + idx * noteDuration);
			osc.stop(now + (idx + 1) * noteDuration);
		});
	}

	public playJump() {
		if (this.muted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'square';
		osc.frequency.setValueAtTime(140, now);
		osc.frequency.exponentialRampToValueAtTime(580, now + 0.16);

		gain.gain.setValueAtTime(0.18, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now);
		osc.stop(now + 0.16);
	}

	public playBump() {
		if (this.muted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'triangle';
		osc.frequency.setValueAtTime(260, now);
		osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

		gain.gain.setValueAtTime(0.25, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now);
		osc.stop(now + 0.12);
	}

	public playStageClear() {
		if (this.muted) return;
		const ctx = this.getContext();
		if (!ctx) return;

		const fanfares = [
			{ f: 523.25, d: 0.1 },
			{ f: 659.25, d: 0.1 },
			{ f: 783.99, d: 0.1 },
			{ f: 1046.5, d: 0.25 }
		];
		let cur = ctx.currentTime;
		fanfares.forEach(({ f, d }) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = 'square';
			osc.frequency.setValueAtTime(f, cur);
			gain.gain.setValueAtTime(0.16, cur);
			gain.gain.exponentialRampToValueAtTime(0.001, cur + d);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(cur);
			osc.stop(cur + d);
			cur += d;
		});
	}

	public toggleMute(): boolean {
		this.muted = !this.muted;
		if (!this.muted) {
			this.playCoin();
		}
		return this.muted;
	}

	public isMuted(): boolean {
		return this.muted;
	}
}

export const sound = new RetroAudioService();
