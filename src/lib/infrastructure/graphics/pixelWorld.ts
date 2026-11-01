import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '../audio/retroAudio';
import type { CastleId, WorldChunk, WorldTextures } from './pixelTypes';
import { createWorldTextures } from './pixelTextures';
import { buildScenery, buildChunk, updateChunk, createSprite } from './pixelWorldBuilder';

export * from './pixelTypes';
export * from './pixelTextures';
export * from './pixelWorldBuilder';

gsap.registerPlugin(ScrollTrigger);

export class PixelWorldEngine {
	private canvas: HTMLCanvasElement;
	private onCoinBump: (x?: number, y?: number) => void;

	private renderer!: THREE.WebGLRenderer;
	private cam!: THREE.OrthographicCamera;
	private scene!: THREE.Scene;

	private S = 2;
	private W = 0;
	private H = 0;

	private tex!: WorldTextures;
	private cloudG!: THREE.Group;
	private hillG!: THREE.Group;
	private bushG!: THREE.Group;
	private worldG!: THREE.Group;
	private groundG!: THREE.Group;

	private castle1!: THREE.Sprite;
	private castle2!: THREE.Sprite;
	private castleSpacing = 160;
	private castlePlaced = false;
	private lockedLoopCamX = 0;

	private mario!: THREE.Sprite;
	private qs: THREE.Sprite[] = [];
	private items: THREE.Sprite[] = [];
	private mats: Record<number, THREE.SpriteMaterial> = {};

	private readonly CHUNK_W = 1200;
	private chunks: WorldChunk[] = [];

	private isEnteringCastle = false;
	private currentCastle: CastleId = 'outside';
	private wasJumping = false;

	private st = { p: 0, sky: new THREE.Color('#5c94fc') };
	private camX = 0;
	private prev = 0;
	private moving = -99;
	private dir = 1;
	private t = 0;
	private running = true;
	private animId = 0;

	private scrollTriggers: ScrollTrigger[] = [];

	constructor(canvas: HTMLCanvasElement, onCoinBump: (x?: number, y?: number) => void) {
		this.canvas = canvas;
		this.onCoinBump = onCoinBump;
		this.init();
	}

	private init() {
		this.S = window.innerWidth < 480 ? 1.6 : window.innerWidth < 768 ? 2.2 : 3;
		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false });
		this.renderer.setPixelRatio(1);

		this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
		this.cam.position.z = 10;
		this.scene = new THREE.Scene();

		this.tex = createWorldTextures();
		this.initWorld();
		this.initScrollTriggers();
		this.bindEvents();

		this.resize();
		this.loop = this.loop.bind(this);
		this.loop();
	}

	private initWorld() {
		const scenery = buildScenery(this.scene, this.tex);
		this.cloudG = scenery.cloudG;
		this.hillG = scenery.hillG;
		this.bushG = scenery.bushG;
		this.worldG = scenery.worldG;
		this.groundG = scenery.groundG;

		this.qs = [];
		this.items = [];

		this.chunks = [
			buildChunk(
				0,
				0,
				this.tex,
				this.worldG,
				(q) => this.qs.push(q),
				(i) => this.items.push(i)
			),
			buildChunk(
				this.CHUNK_W,
				1,
				this.tex,
				this.worldG,
				(q) => this.qs.push(q),
				(i) => this.items.push(i)
			)
		];

		this.castle1 = createSprite(this.tex.castle1, 80, 72, 99999, 32 + 36, 4, this.worldG);
		this.castle2 = createSprite(
			this.tex.castle2,
			88,
			80,
			99999 + this.castleSpacing,
			32 + 40,
			4,
			this.worldG
		);
		this.castle1.visible = false;
		this.castle2.visible = false;

		this.mario = createSprite(this.tex.mario.stand, 12, 16, 0, 40, 8, this.worldG);
	}

	private popCoin(x: number, y: number) {
		const s = createSprite(this.tex.coins[0], 8, 14, x, y + 16, 9, this.worldG);
		gsap.to(s.position, {
			y: y + 52,
			duration: 0.35,
			ease: 'power2.out',
			onUpdate: () => {
				s.position.y = Math.round(s.position.y);
			},
			onComplete: () => {
				this.worldG.remove(s);
				s.material.dispose();
			}
		});
	}

	public hit(b: THREE.Sprite) {
		if (b.userData.cool) {
			sound.playBump();
			return;
		}
		b.userData.cool = true;
		sound.playCoin();
		gsap.to(b.userData, { off: 6, duration: 0.1, yoyo: true, repeat: 1 });
		this.onCoinBump();
		this.popCoin(b.position.x, b.position.y);
	}

	private onPointerDown = (e: MouseEvent) => {
		const target = e.target as HTMLElement | null;
		if (target?.closest('a, button, nav')) return;

		const wx = Math.round(this.camX) + (e.clientX / this.S - this.W / 2);
		const wy = this.H - e.clientY / this.S;
		this.qs.forEach((b) => {
			if (b.visible && Math.abs(wx - b.position.x) < 12 && Math.abs(wy - b.position.y) < 12) {
				this.hit(b);
			}
		});
	};

	private onVisibilityChange = () => {
		this.running = !document.hidden;
		if (this.running) this.loop();
	};

	public resize = () => {
		this.S = window.innerWidth < 480 ? 1.6 : window.innerWidth < 768 ? 2.2 : 3;
		this.W = 2 * Math.ceil(window.innerWidth / this.S / 2);
		this.H = 2 * Math.ceil(window.innerHeight / this.S / 2);
		this.renderer.setSize(this.W, this.H, false);

		this.cam.left = -this.W / 2;
		this.cam.right = this.W / 2;
		this.cam.top = this.H / 2;
		this.cam.bottom = -this.H / 2;
		this.cam.updateProjectionMatrix();

		this.worldG.position.y =
			this.groundG.position.y =
			this.hillG.position.y =
			this.bushG.position.y =
				-this.H / 2;
		this.cloudG.position.y = this.H / 2;

		this.castleSpacing = this.W < 280 ? 95 : this.W < 360 ? 120 : 160;
		if (this.castlePlaced) {
			this.castle2.position.x = this.castle1.position.x + this.castleSpacing;
		}
	};

	private initScrollTriggers() {
		const skies = ['#5c94fc', '#5c94fc', '#5c94fc', '#000000', '#5c94fc', '#000000'];
		const dark = [false, false, false, true, false, true];
		const ids = ['home', 'about', 'skills', 'projects', 'journey', 'contact'];

		const mainTrigger = ScrollTrigger.create({
			trigger: 'main',
			start: 'top top',
			end: 'bottom bottom',
			onUpdate: (self) => {
				this.st.p = self.progress;
			}
		});
		this.scrollTriggers.push(mainTrigger);

		ids.forEach((id, i) => {
			const tr = ScrollTrigger.create({
				trigger: '#' + id,
				start: 'top 55%',
				end: 'bottom 55%',
				onToggle: (self) => {
					if (!self.isActive) return;
					const c = new THREE.Color(skies[i]);
					gsap.to(this.st.sky, { r: c.r, g: c.g, b: c.b, duration: 0.8 });
					this.cloudG.visible = this.hillG.visible = this.bushG.visible = !dark[i];
				}
			});
			this.scrollTriggers.push(tr);
		});

		gsap.utils.toArray<HTMLElement>('.rv').forEach((el) => {
			gsap.from(el, {
				opacity: 0,
				y: 30,
				duration: 0.6,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: el,
					start: 'top 88%',
					toggleActions: 'play none none reverse'
				}
			});
		});
	}

	private bindEvents() {
		window.addEventListener('resize', this.resize);
		window.addEventListener('pointerdown', this.onPointerDown);
		document.addEventListener('visibilitychange', this.onVisibilityChange);
	}

	public enterCastle(onEntered?: () => void) {
		if (this.isEnteringCastle) {
			onEntered?.();
			return;
		}
		this.isEnteringCastle = true;

		if (this.currentCastle === 'outside') {
			const targetX = this.castle1.position.x;
			this.runMarioTransition(targetX, 1, () => {
				this.currentCastle = 'castle1';
				this.isEnteringCastle = false;
				onEntered?.();
			});
		} else if (this.currentCastle === 'castle1') {
			this.mario.position.x = this.castle1.position.x;
			sound.playJump();

			const targetX = this.castle2.position.x;
			this.runMarioTransition(targetX, 1, () => {
				this.currentCastle = 'castle2';
				this.isEnteringCastle = false;
				onEntered?.();
			});
		} else {
			this.mario.position.x = this.castle2.position.x;
			sound.playJump();

			const targetX = this.castle1.position.x;
			this.runMarioTransition(targetX, -1, () => {
				this.currentCastle = 'castle1';
				this.isEnteringCastle = false;
				onEntered?.();
			});
		}
	}

	private runMarioTransition(targetX: number, dir: 1 | -1, onDone: () => void) {
		this.mario.scale.x = 12 * dir;
		this.mario.visible = true;
		this.mario.material.opacity = 1;

		const startX = this.mario.position.x;
		const distance = Math.max(30, Math.abs(targetX - startX));
		const duration = Math.min(2.0, Math.max(0.4, distance / 220));

		gsap.to(this.mario.position, {
			x: targetX,
			duration,
			ease: 'linear',
			onUpdate: () => {
				this.mario.material.map =
					Math.floor(this.t / 4) % 2 ? this.tex.mario.w1 : this.tex.mario.w2;
			},
			onComplete: () => {
				this.mario.material.map = this.tex.mario.stand;
				sound.playStageClear();
				gsap.to(this.mario.material, {
					opacity: 0,
					duration: 0.25,
					onComplete: () => {
						this.mario.visible = false;
						onDone();
					}
				});
			}
		});
	}

	private loop() {
		if (!this.running) return;
		this.animId = requestAnimationFrame(this.loop);
		this.t++;

		const contactEl = typeof document !== 'undefined' ? document.getElementById('contact') : null;
		let contactProgress = 0;

		if (contactEl) {
			const rect = contactEl.getBoundingClientRect();
			const vh = window.innerHeight;
			if (rect.top <= vh * 1.15) {
				contactProgress = Math.max(0, Math.min(1, (vh * 1.15 - rect.top) / (vh * 0.95)));
			}
		}

		let targetCamX = 0;

		if (contactProgress <= 0) {
			if (this.castlePlaced) {
				this.castlePlaced = false;
				this.castle1.visible = false;
				this.castle2.visible = false;
				this.chunks.forEach((chunk) => {
					chunk.items.forEach((s) => {
						if (!s.userData.got) s.visible = true;
					});
				});
			}

			targetCamX = (typeof window !== 'undefined' ? window.scrollY : 0) * 0.65;

			this.chunks.forEach((chunk) => {
				if (this.camX > chunk.originX + this.CHUNK_W + 160) {
					chunk.originX += 2 * this.CHUNK_W;
					updateChunk(chunk);
				} else if (this.camX < chunk.originX - 160) {
					chunk.originX -= 2 * this.CHUNK_W;
					updateChunk(chunk);
				}
			});
		} else {
			if (!this.castlePlaced) {
				this.castlePlaced = true;
				this.lockedLoopCamX = this.camX;
				const baseX = Math.round(this.camX + this.W * 0.45 + 110);
				this.castle1.position.x = baseX;
				this.castle2.position.x = baseX + this.castleSpacing;
				this.castle1.visible = true;
				this.castle2.visible = true;

				this.chunks.forEach((chunk) => {
					chunk.items.forEach((s) => {
						if (s.position.x > baseX - 45) {
							s.visible = false;
						}
					});
				});
			}

			const castleMid = (this.castle1.position.x + this.castle2.position.x) / 2;
			const ease = 1 - Math.pow(1 - contactProgress, 3);
			targetCamX = this.lockedLoopCamX + (castleMid - this.lockedLoopCamX) * ease;
		}

		if (this.currentCastle === 'castle2') {
			targetCamX = this.castle2.position.x;
		} else if (this.currentCastle === 'castle1') {
			targetCamX = this.castle1.position.x;
		}

		const step = (targetCamX - this.camX) * 0.16;
		const maxStep = 9;
		this.camX += Math.max(-maxStep, Math.min(maxStep, step));
		const d = this.camX - this.prev;
		this.prev = this.camX;
		if (Math.abs(d) > 0.05) {
			this.moving = this.t;
			this.dir = d > 0 ? 1 : -1;
		}

		const cx = Math.round(this.camX);
		this.cam.position.x = cx;

		this.groundG.position.x = Math.round(this.camX / 16) * 16;

		this.cloudG.position.x = cx;
		this.hillG.position.x = cx;
		this.bushG.position.x = cx;

		const wrapSpan = Math.max(1600, this.W * 2);

		this.cloudG.children.forEach((c) => {
			const rel =
				((c.userData.baseX - this.camX * 0.4) % wrapSpan + wrapSpan) % wrapSpan - wrapSpan / 2;
			c.position.x = Math.round(rel);
		});

		this.hillG.children.forEach((h) => {
			const rel =
				((h.userData.baseX - this.camX * 0.6) % wrapSpan + wrapSpan) % wrapSpan - wrapSpan / 2;
			h.position.x = Math.round(rel);
		});

		this.bushG.children.forEach((b) => {
			const rel =
				((b.userData.baseX - this.camX * 0.8) % wrapSpan + wrapSpan) % wrapSpan - wrapSpan / 2;
			b.position.x = Math.round(rel);
		});

		if (!this.isEnteringCastle) {
			if (this.currentCastle === 'outside') {
				let mx = cx - Math.round(this.W * 0.25);
				let isAtCastleStop = false;

				if (this.castlePlaced) {
					const stopX = this.castle1.position.x - 30;
					if (mx >= stopX) {
						mx = stopX;
						isAtCastleStop = true;
					}
				}

				this.mario.position.x = mx;
				this.mario.scale.x = 12 * this.dir;
				this.mario.visible = true;
				this.mario.material.opacity = 1;

				let jumpY = 0;
				let jumpProgress = 0;
				const jumpRadius = 48;

				if (!isAtCastleStop) {
					this.items.forEach((s) => {
						if (s.visible && s.userData.kind === 'coin') {
							const dx = Math.abs(mx - s.position.x);
							if (dx < jumpRadius) {
								const peakH = Math.max(0, s.userData.baseY - 40);
								const p = (mx - (s.position.x - jumpRadius)) / (2 * jumpRadius);
								const bell = 0.5 - 0.5 * Math.cos(2 * p * Math.PI);
								const h = peakH * bell;
								if (h > jumpY) {
									jumpY = h;
									jumpProgress = p;
								}
							}
						}
					});

					this.qs.forEach((q) => {
						if (q.visible) {
							const dx = Math.abs(mx - q.position.x);
							if (dx < 36) {
								const peakH = 34;
								const p = (mx - (q.position.x - 36)) / 72;
								const bell = 0.5 - 0.5 * Math.cos(2 * p * Math.PI);
								const h = peakH * bell;
								if (h > jumpY) {
									jumpY = h;
									jumpProgress = p;
								}
							}
						}
					});
				}

				const targetY = 40 + jumpY;
				this.mario.position.y += (targetY - this.mario.position.y) * 0.42;

				const curElev = this.mario.position.y - 40;

				if (curElev > 4 && !this.wasJumping && this.t - this.moving < 8) {
					sound.playJump();
					this.wasJumping = true;
				} else if (curElev <= 2) {
					this.wasJumping = false;
				}

				if (curElev > 3) {
					if (jumpProgress < 0.38) {
						this.mario.material.map = this.tex.mario.jump;
					} else if (jumpProgress <= 0.62) {
						this.mario.material.map = this.tex.mario.apex;
					} else {
						this.mario.material.map = this.tex.mario.fall;
					}
				} else {
					this.mario.material.map =
						this.t - this.moving < 8 && !isAtCastleStop
							? Math.floor(this.t / 5) % 2
								? this.tex.mario.w1
								: this.tex.mario.w2
							: this.tex.mario.stand;
				}
			} else {
				this.mario.visible = false;
				if (contactProgress < 0.3) {
					this.currentCastle = 'outside';
					this.mario.visible = true;
					this.mario.material.opacity = 1;
				}
			}

			this.qs.forEach((b) => {
				if (b.visible) {
					const dx = Math.abs(this.mario.position.x - b.position.x);
					if (dx < 8 && this.mario.position.y >= 64 && this.mario.visible) this.hit(b);
					else if (dx > 40) b.userData.cool = false;
					b.position.y = b.userData.y + Math.round(b.userData.off);
				}
			});

			this.items.forEach((s) => {
				if (!s.visible || s.userData.got) return;
				if (s.userData.kind === 'coin') {
					const frame = (Math.floor(this.t / 8) + s.userData.i) % 4;
					s.material =
						this.mats[frame] ||
						(this.mats[frame] = new THREE.SpriteMaterial({
							map: this.tex.coins[frame],
							transparent: true,
							depthTest: false
						}));
				}
				const dx = Math.abs(this.mario.position.x - s.position.x);
				const dy = Math.abs(this.mario.position.y - s.position.y);
				if (dx < 12 && dy < 16 && this.mario.visible) {
					s.userData.got = true;
					s.visible = false;
					if (s.userData.kind === 'mush') {
						sound.playPowerUp();
					} else {
						sound.playCoin();
						this.onCoinBump();
					}
				}
			});
		}

		this.renderer.setClearColor(this.st.sky, 1);
		this.renderer.render(this.scene, this.cam);
	}

	public destroy() {
		cancelAnimationFrame(this.animId);
		this.running = false;
		window.removeEventListener('resize', this.resize);
		window.removeEventListener('pointerdown', this.onPointerDown);
		document.removeEventListener('visibilitychange', this.onVisibilityChange);
		this.scrollTriggers.forEach((st) => st.kill());
		this.renderer.dispose();
	}
}
