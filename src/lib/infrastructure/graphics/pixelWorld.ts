import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '../audio/retroAudio';

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

	private cloudG!: THREE.Group;
	private hillG!: THREE.Group;
	private bushG!: THREE.Group;
	private worldG!: THREE.Group;
	private groundG!: THREE.Group;

	private castle!: THREE.Sprite;
	private mario!: THREE.Sprite;
	private marioT: Record<string, THREE.CanvasTexture> = {};
	private qs: THREE.Sprite[] = [];
	private items: THREE.Sprite[] = [];
	private coinT: THREE.CanvasTexture[] = [];
	private mats: Record<number, THREE.SpriteMaterial> = {};

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
		this.S = window.innerWidth < 700 ? 2 : 3;
		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false });
		this.renderer.setPixelRatio(1);

		this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
		this.cam.position.z = 10;
		this.scene = new THREE.Scene();

		this.initTexturesAndSprites();
		this.initWorld();
		this.initScrollTriggers();
		this.bindEvents();

		this.resize();
		this.loop = this.loop.bind(this);
		this.loop();
	}

	private cv(w: number, h: number, fn: (ctx: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
		const c = document.createElement('canvas');
		c.width = w;
		c.height = h;
		const ctx = c.getContext('2d')!;
		ctx.imageSmoothingEnabled = false;
		fn(ctx);
		const tex = new THREE.CanvasTexture(c);
		tex.magFilter = tex.minFilter = THREE.NearestFilter;
		tex.generateMipmaps = false;
		return tex;
	}

	private fromMap(rows: string[], w: number): THREE.CanvasTexture {
		const PAL: Record<string, string> = {
			R: '#d82800',
			B: '#6c3b00',
			S: '#fc9838',
			W: '#fcfcfc',
			K: '#000000',
			Y: '#fcd800',
			T: '#fce0a8'
		};
		return this.cv(w, rows.length, (ctx) => {
			rows.forEach((r, y) => {
				[...r.padEnd(w, '.')].forEach((char, i) => {
					if (char !== '.' && PAL[char]) {
						ctx.fillStyle = PAL[char];
						ctx.fillRect(i, y, 1, 1);
					}
				});
			});
		});
	}

	private shape(
		w: number,
		h: number,
		inside: (a: number, b: number) => boolean,
		fill: string,
		edge: string,
		extra?: (ctx: CanvasRenderingContext2D) => void
	): THREE.CanvasTexture {
		return this.cv(w, h, (ctx) => {
			const i = (a: number, b: number) => a >= 0 && b >= 0 && a < w && b < h && inside(a, b);
			for (let y = 0; y < h; y++) {
				for (let a = 0; a < w; a++) {
					if (!i(a, y)) continue;
					ctx.fillStyle = i(a - 1, y) && i(a + 1, y) && i(a, y - 1) && i(a, y + 1) ? fill : edge;
					ctx.fillRect(a, y, 1, 1);
				}
			}
			if (extra) extra(ctx);
		});
	}

	private initTexturesAndSprites() {
		const circ = (cx: number, cy: number, r: number) => (a: number, b: number) =>
			(a - cx) ** 2 + (b - cy) ** 2 <= r * r;

		const top = [
			'....RRRRR...',
			'...RRRRRRRRR',
			'...BBBSSBS..',
			'..BSBSSSBSSS',
			'..BSBBSSSBSS',
			'..BBSSSSBBBB',
			'....SSSSSSS.',
			'...RRBRRB...',
			'..RRRBRRBRRR',
			'.RRRRBBBBRRR',
			'SSRBYBBYBRSS',
			'SSSBBBBBBSSS',
			'SSBBBBBBBBSS'
		];
		const legs = {
			stand: ['..BBB..BBB..', '.BBBB..BBBB.', 'BBBB....BBBB'],
			w1: ['...BBBBB....', '..BBBBBBB...', '..BBB..BBBB.'],
			w2: ['....BBBBB...', '...BBBBBBB..', '..BBBB..BBB.']
		};

		this.marioT = {
			stand: this.fromMap(top.concat(legs.stand), 12),
			w1: this.fromMap(top.concat(legs.w1), 12),
			w2: this.fromMap(top.concat(legs.w2), 12)
		};

		this.coinT = [8, 6, 2, 6].map((w) =>
			this.cv(8, 14, (ctx) => {
				const o = (8 - w) / 2;
				ctx.fillStyle = '#a85800';
				ctx.fillRect(o, 1, w, 12);
				ctx.fillRect(o + 1, 0, Math.max(w - 2, 0), 14);
				if (w > 3) {
					ctx.fillStyle = '#fcc000';
					ctx.fillRect(o + 1, 2, w - 2, 10);
					ctx.fillRect(o + 2, 1, w - 4, 12);
				}
			})
		);
	}

	private mk(
		tex: THREE.CanvasTexture,
		w: number,
		h: number,
		x: number,
		y: number,
		z: number,
		parent?: THREE.Object3D
	): THREE.Sprite {
		const s = new THREE.Sprite(
			new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })
		);
		s.scale.set(w, h, 1);
		s.position.set(x, y, 0);
		s.renderOrder = z;
		s.userData = { x, y, off: 0 };
		(parent || this.scene).add(s);
		return s;
	}

	private grp(): THREE.Group {
		const g = new THREE.Group();
		this.scene.add(g);
		return g;
	}

	private initWorld() {
		const circ = (cx: number, cy: number, r: number) => (a: number, b: number) =>
			(a - cx) ** 2 + (b - cy) ** 2 <= r * r;

		const cloudT = this.shape(
			32,
			24,
			(a, b) =>
				circ(8, 16, 8)(a, b) ||
				circ(16, 10, 10)(a, b) ||
				circ(24, 16, 8)(a, b) ||
				(b >= 16 && b < 24 && a >= 8 && a <= 24),
			'#fcfcfc',
			'#a4e4fc'
		);
		const bushT = this.shape(
			32,
			16,
			(a, b) =>
				b < 16 &&
				(circ(8, 10, 6)(a, b) ||
					circ(16, 8, 8)(a, b) ||
					circ(24, 10, 6)(a, b) ||
					(b >= 10 && a >= 8 && a <= 24)),
			'#00a800',
			'#005800'
		);
		const hillT = this.shape(
			80,
			40,
			(a, b) => ((a - 40) / 40) ** 2 + ((b - 40) / 38) ** 2 <= 1,
			'#00a800',
			'#005800',
			(ctx) => {
				ctx.fillStyle = '#000';
				ctx.fillRect(34, 16, 2, 4);
				ctx.fillRect(44, 16, 2, 4);
			}
		);

		const qTex = this.cv(16, 16, (x) => {
			x.fillStyle = '#000';
			x.fillRect(0, 0, 16, 16);
			x.fillStyle = '#fcb800';
			x.fillRect(1, 1, 14, 14);
			x.fillStyle = '#a84000';
			[
				[2, 2],
				[13, 2],
				[2, 13],
				[13, 13]
			].forEach((p) => x.fillRect(p[0], p[1], 1, 1));
			[
				'..KKKK..',
				'.KK..KK.',
				'.KK..KK.',
				'....KK..',
				'...KK...',
				'...KK...',
				'........',
				'...KK...'
			].forEach((r, y) => {
				[...r].forEach((c, i) => {
					if (c === 'K') x.fillRect(4 + i, 4 + y, 1, 1);
				});
			});
		});

		const brickT = this.cv(16, 16, (x) => {
			x.fillStyle = '#c84c0c';
			x.fillRect(0, 0, 16, 16);
			x.fillStyle = '#000';
			for (let r = 0; r < 4; r++) {
				x.fillRect(0, r * 4 + 3, 16, 1);
				(r % 2 ? [3, 11] : [7, 15]).forEach((v) => x.fillRect(v, r * 4, 1, 3));
			}
		});

		const mushT = this.fromMap(
			[
				'......RRRR......',
				'....RRRWWRRR....',
				'...RRRWWWWRRRR..',
				'..RRRRWWWWRRRRR.',
				'.RWWRRRRRRRRWWRR',
				'.RWWRRRRRRRRWWRR',
				'RRWWRRRRRRRRWWRR',
				'RRRRRRRRRRRRRRRR',
				'..BBTTTTTTTTBB..',
				'...TTKTTTTKTT...',
				'...TTKTTTTKTT...',
				'...TTTTTTTTTT...',
				'....TTTTTTTT....',
				'....TTTTTTTT....',
				'....TTTTTTTT....',
				'....TTTTTTTT....'
			],
			16
		);

		const pipeT = (h: number) =>
			this.cv(32, h, (x) => {
				x.fillStyle = '#000';
				x.fillRect(0, 0, 32, 14);
				x.fillRect(2, 14, 28, h - 14);
				x.fillStyle = '#00a800';
				x.fillRect(1, 1, 30, 12);
				x.fillRect(3, 14, 26, h - 14);
				x.fillStyle = '#80d010';
				x.fillRect(3, 2, 3, 10);
				x.fillRect(5, 14, 3, h - 14);
				x.fillStyle = '#005800';
				x.fillRect(26, 2, 4, 10);
				x.fillRect(23, 14, 4, h - 14);
			});

		const castleT = this.cv(80, 72, (x) => {
			x.fillStyle = '#c84c0c';
			x.fillRect(8, 24, 64, 48);
			x.fillRect(24, 8, 32, 16);
			for (let i = 0; i < 5; i++) x.fillRect(8 + i * 14, 16, 8, 8);
			for (let i = 0; i < 3; i++) x.fillRect(24 + i * 12, 0, 8, 8);
			x.fillStyle = '#000';
			for (let y = 31; y < 72; y += 8) x.fillRect(8, y, 64, 1);
			x.fillRect(32, 48, 16, 24);
			x.fillRect(34, 44, 12, 4);
			x.fillRect(36, 12, 8, 8);
		});

		this.cloudG = this.grp();
		this.hillG = this.grp();
		this.bushG = this.grp();
		this.worldG = this.grp();
		this.groundG = this.grp();

		for (let i = 0; i < 26; i++) {
			this.mk(cloudT, 32, 24, -1200 + i * 140, -30 - (i % 3) * 20, 1, this.cloudG);
		}
		for (let i = 0; i < 18; i++) {
			this.mk(hillT, 80, 40, -1200 + i * 260, 20 + 32, 2, this.hillG);
		}
		for (let i = 0; i < 22; i++) {
			this.mk(bushT, 32, 16, -1200 + i * 300, 32 + 8, 3, this.bushG);
		}

		const groundWidth = 6400;
		const gt = brickT.clone();
		gt.needsUpdate = true;
		gt.wrapS = gt.wrapT = THREE.RepeatWrapping;
		gt.repeat.set(groundWidth / 16, 2);
		gt.magFilter = gt.minFilter = THREE.NearestFilter;

		const groundMesh = new THREE.Mesh(
			new THREE.PlaneGeometry(groundWidth, 32),
			new THREE.MeshBasicMaterial({ map: gt, depthTest: false })
		);
		groundMesh.position.set(1700, 16, 0);
		groundMesh.renderOrder = 6;
		this.groundG.add(groundMesh);

		[
			[600, 32],
			[1500, 48],
			[2000, 64]
		].forEach(([x, h]) => {
			this.mk(pipeT(h), 32, h, x, 32 + h / 2, 4, this.worldG);
		});

		this.castle = this.mk(castleT, 80, 72, 2500, 32 + 36, 4, this.worldG);

		this.qs = [];
		[260, 760, 1260, 1760, 2160].forEach((x) => {
			this.mk(brickT, 16, 16, x - 16, 88, 5, this.worldG);
			this.mk(brickT, 16, 16, x + 16, 88, 5, this.worldG);
			const q = this.mk(qTex, 16, 16, x, 88, 5, this.worldG);
			q.userData.cool = false;
			this.qs.push(q);
		});

		this.items = [];
		for (let i = 0; i < 14; i++) {
			const x = 420 + i * 150;
			const s = this.mk(
				this.coinT[0],
				8,
				14,
				x,
				32 + 14 + Math.round(Math.sin(i * 0.9) * 16) + 20,
				5,
				this.worldG
			);
			s.userData.kind = 'coin';
			s.userData.i = i;
			this.items.push(s);
		}

		[1130, 1370].forEach((x) => {
			const s = this.mk(mushT, 16, 16, x, 40, 5, this.worldG);
			s.userData.kind = 'mush';
			this.items.push(s);
		});

		this.mario = this.mk(this.marioT.stand, 12, 16, 0, 40, 8, this.worldG);
	}

	private popCoin(x: number, y: number) {
		const s = this.mk(this.coinT[0], 8, 14, x, y + 16, 9, this.worldG);
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
		this.popCoin(b.userData.x, b.userData.y);
	}

	private onPointerDown = (e: MouseEvent) => {
		const target = e.target as HTMLElement | null;
		if (target?.closest('a, button, nav')) return;

		const wx = Math.round(this.camX) + (e.clientX / this.S - this.W / 2);
		const wy = this.H - e.clientY / this.S;
		this.qs.forEach((b) => {
			if (Math.abs(wx - b.userData.x) < 10 && Math.abs(wy - b.userData.y) < 10) {
				this.hit(b);
			}
		});
	};

	private onVisibilityChange = () => {
		this.running = !document.hidden;
		if (this.running) this.loop();
	};

	public resize = () => {
		this.S = window.innerWidth < 700 ? 2 : 3;
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
		this.castle.position.x = 2400 + 2 * Math.round(0.11 * this.W);
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

	private isEnteringCastle = false;

	public enterCastle(onEntered?: () => void) {
		if (this.isEnteringCastle) {
			if (onEntered) onEntered();
			return;
		}
		this.isEnteringCastle = true;
		sound.playStageClear();

		const targetX = this.castle.position.x;
		this.mario.scale.x = 12;
		this.mario.visible = true;
		this.mario.material.opacity = 1;

		const startX = this.mario.position.x;
		const distance = Math.max(80, targetX - startX);
		const duration = Math.min(2.0, Math.max(0.8, distance / 260));

		gsap.to(this.mario.position, {
			x: targetX,
			duration,
			ease: 'power1.in',
			onUpdate: () => {
				this.mario.material.map =
					Math.floor(this.t / 4) % 2 ? this.marioT.w1 : this.marioT.w2;
			},
			onComplete: () => {
				this.mario.material.map = this.marioT.stand;
				gsap.to(this.mario.material, {
					opacity: 0,
					duration: 0.3,
					onComplete: () => {
						this.mario.visible = false;
						if (onEntered) {
							onEntered();
						}
						setTimeout(() => {
							this.mario.visible = true;
							this.mario.material.opacity = 1;
							this.isEnteringCastle = false;
						}, 3000);
					}
				});
			}
		});
	}

	private loop() {
		if (!this.running) return;
		this.animId = requestAnimationFrame(this.loop);
		this.t++;

		this.camX += (this.st.p * 2400 - this.camX) * 0.18;
		const d = this.camX - this.prev;
		this.prev = this.camX;
		if (Math.abs(d) > 0.05) {
			this.moving = this.t;
			this.dir = d > 0 ? 1 : -1;
		}

		const cx = Math.round(this.camX);
		this.cam.position.x = cx;
		this.cloudG.position.x = Math.round(this.camX * 0.7);
		this.hillG.position.x = Math.round(this.camX * 0.5);
		this.bushG.position.x = Math.round(this.camX * 0.2);

		if (!this.isEnteringCastle) {
			const mx = cx - Math.round(this.W * 0.25);
			this.mario.position.x = mx;
			this.mario.scale.x = 12 * this.dir;
			this.mario.material.map =
				this.t - this.moving < 8
					? Math.floor(this.t / 5) % 2
						? this.marioT.w1
						: this.marioT.w2
					: this.marioT.stand;

			this.qs.forEach((b) => {
				const dx = Math.abs(mx - b.userData.x);
				if (dx < 8) this.hit(b);
				else if (dx > 40) b.userData.cool = false;
				b.position.y = b.userData.y + Math.round(b.userData.off);
			});

			this.items.forEach((s) => {
				if (s.userData.got) return;
				if (s.userData.kind === 'coin') {
					const frame = (Math.floor(this.t / 8) + s.userData.i) % 4;
					s.material =
						this.mats[frame] ||
						(this.mats[frame] = new THREE.SpriteMaterial({
							map: this.coinT[frame],
							transparent: true,
							depthTest: false
						}));
				}
				if (Math.abs(mx - s.userData.x) < 8) {
					s.userData.got = true;
					s.visible = false;
					sound.playCoin();
					this.onCoinBump();
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
