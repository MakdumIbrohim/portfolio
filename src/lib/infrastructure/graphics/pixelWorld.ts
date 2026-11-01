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

	private castle1!: THREE.Sprite;
	private castle2!: THREE.Sprite;
	private castleSpacing = 160;
	private castlePlaced = false;
	private castleBaseX = 0;
	private lockedLoopCamX = 0;
	private isApproachingContact = false;

	private mario!: THREE.Sprite;
	private marioT: Record<string, THREE.CanvasTexture> = {};
	private qs: THREE.Sprite[] = [];
	private items: THREE.Sprite[] = [];
	private coinT: THREE.CanvasTexture[] = [];
	private mats: Record<number, THREE.SpriteMaterial> = {};

	private readonly CHUNK_W = 1200;
	private chunks: { originX: number; items: THREE.Sprite[] }[] = [];

	private isEnteringCastle = false;
	private currentCastle: 'outside' | 'castle1' | 'castle2' = 'outside';
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
			w2: ['....BBBBB...', '...BBBBBBB..', '..BBBB..BBB.'],
			jump: ['..BBBB..BBB.', '.BBBB....BBB', 'BBBB........'],
			apex: ['..BBBBBBBB..', '..BBBBBBBB..', '..BB....BB..'],
			fall: ['...BB..BB...', '..BBBB.BBBB.', '..BBBB.BBBB.']
		};

		const jumpBody = [
			'...RRBRRB.SS',
			'..RRRBRRBRSS',
			'.RRRRBBBBRRR',
			'SSRBYBBYBR..',
			'SS.BBBBBB...',
			'.S.BBBBBB...'
		];

		const apexBody = [
			'...RRBRRB...',
			'SSRRRBRRBRSS',
			'SSRRRBBBBRSS',
			'.SRBYBBYBRS.',
			'...BBBBBB...',
			'...BBBBBB...'
		];

		const fallBody = [
			'SS.RRBRRB.SS',
			'.SSRRBRRBRS.',
			'..RRRBBBBRRR',
			'...BYBBYB...',
			'...BBBBBB...',
			'...BBBBBB...'
		];

		const headRows = top.slice(0, 7);

		this.marioT = {
			stand: this.fromMap(top.concat(legs.stand), 12),
			w1: this.fromMap(top.concat(legs.w1), 12),
			w2: this.fromMap(top.concat(legs.w2), 12),
			jump: this.fromMap(headRows.concat(jumpBody, legs.jump), 12),
			apex: this.fromMap(headRows.concat(apexBody, legs.apex), 12),
			fall: this.fromMap(headRows.concat(fallBody, legs.fall), 12)
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

		const castle2T = this.cv(88, 80, (x) => {
			x.fillStyle = '#1e1b4b';
			x.fillRect(8, 24, 72, 56);
			x.fillRect(24, 6, 40, 20);
			for (let i = 0; i < 5; i++) x.fillRect(8 + i * 16, 14, 10, 10);
			for (let i = 0; i < 3; i++) x.fillRect(24 + i * 16, 0, 10, 8);
			x.fillStyle = '#312e81';
			for (let y = 30; y < 80; y += 8) x.fillRect(8, y, 72, 1);
			x.fillStyle = '#fbd000';
			x.fillRect(38, 12, 12, 10);
			x.fillRect(20, 34, 8, 12);
			x.fillRect(60, 34, 8, 12);
			x.fillStyle = '#000000';
			x.fillRect(36, 52, 16, 28);
			x.fillRect(38, 48, 12, 4);
		});

		this.cloudG = this.grp();
		this.hillG = this.grp();
		this.bushG = this.grp();
		this.worldG = this.grp();
		this.groundG = this.grp();

		for (let i = 0; i < 20; i++) {
			const s = this.mk(cloudT, 32, 24, -800 + i * 160, -30 - (i % 3) * 20, 1, this.cloudG);
			s.userData.baseX = -800 + i * 160;
		}
		for (let i = 0; i < 16; i++) {
			const s = this.mk(hillT, 80, 40, -800 + i * 260, 20 + 32, 2, this.hillG);
			s.userData.baseX = -800 + i * 260;
		}
		for (let i = 0; i < 18; i++) {
			const s = this.mk(bushT, 32, 16, -800 + i * 280, 32 + 8, 3, this.bushG);
			s.userData.baseX = -800 + i * 280;
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
		groundMesh.position.set(0, 16, 0);
		groundMesh.renderOrder = 6;
		this.groundG.add(groundMesh);

		// 2 procedural looping chunks
		this.chunks = [
			{ originX: 0, items: [] },
			{ originX: this.CHUNK_W, items: [] }
		];

		this.qs = [];
		this.items = [];

		this.chunks.forEach((chunk, chunkIdx) => {
			// Pipes in chunk
			[
				[320, 32],
				[720, 48],
				[1080, 64]
			].forEach(([relX, h]) => {
				const pipe = this.mk(pipeT(h), 32, h, chunk.originX + relX, 32 + h / 2, 4, this.worldG);
				pipe.userData.relX = relX;
				pipe.userData.chunkIdx = chunkIdx;
				chunk.items.push(pipe);
			});

			// Question blocks with bricks
			[160, 540, 920].forEach((relX) => {
				const bLeft = this.mk(brickT, 16, 16, chunk.originX + relX - 16, 88, 5, this.worldG);
				bLeft.userData.relX = relX - 16;
				bLeft.userData.chunkIdx = chunkIdx;
				chunk.items.push(bLeft);

				const bRight = this.mk(brickT, 16, 16, chunk.originX + relX + 16, 88, 5, this.worldG);
				bRight.userData.relX = relX + 16;
				bRight.userData.chunkIdx = chunkIdx;
				chunk.items.push(bRight);

				const q = this.mk(qTex, 16, 16, chunk.originX + relX, 88, 5, this.worldG);
				q.userData.relX = relX;
				q.userData.chunkIdx = chunkIdx;
				q.userData.cool = false;
				chunk.items.push(q);
				this.qs.push(q);
			});

			// Coins
			[80, 240, 400, 480, 640, 780, 860, 1000].forEach((relX, j) => {
				const coinY = 32 + 14 + Math.round(Math.sin((j + chunkIdx * 3) * 0.9) * 16) + 20;
				const coin = this.mk(this.coinT[0], 8, 14, chunk.originX + relX, coinY, 5, this.worldG);
				coin.userData.relX = relX;
				coin.userData.baseY = coinY;
				coin.userData.kind = 'coin';
				coin.userData.i = j;
				coin.userData.chunkIdx = chunkIdx;
				chunk.items.push(coin);
				this.items.push(coin);
			});

			// Mushroom
			const mush = this.mk(mushT, 16, 16, chunk.originX + 440, 40, 5, this.worldG);
			mush.userData.relX = 440;
			mush.userData.baseY = 40;
			mush.userData.kind = 'mush';
			mush.userData.chunkIdx = chunkIdx;
			chunk.items.push(mush);
			this.items.push(mush);
		});

		// Final Stage Castles (hidden during stage loop, revealed on contact approach)
		this.castle1 = this.mk(castleT, 80, 72, 99999, 32 + 36, 4, this.worldG);
		this.castle2 = this.mk(castle2T, 88, 80, 99999 + this.castleSpacing, 32 + 40, 4, this.worldG);
		this.castle1.visible = false;
		this.castle2.visible = false;

		this.mario = this.mk(this.marioT.stand, 12, 16, 0, 40, 8, this.worldG);
	}

	private updateChunk(chunk: { originX: number; items: THREE.Sprite[] }) {
		chunk.items.forEach((s) => {
			const wx = chunk.originX + s.userData.relX;
			s.position.x = s.userData.x = wx;
			if (s.userData.kind === 'coin') {
				s.userData.got = false;
				s.visible = true;
			}
			if (s.userData.cool !== undefined) {
				s.userData.cool = false;
			}
		});
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
					Math.floor(this.t / 4) % 2 ? this.marioT.w1 : this.marioT.w2;
			},
			onComplete: () => {
				this.mario.material.map = this.marioT.stand;
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

		// Distance detection algorithm to #contact
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
			// 1. STAGE LOOP PHASE (Home, About, Skills, Projects, Journey)
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

			// Scroll-driven camera advancement
			targetCamX = (typeof window !== 'undefined' ? window.scrollY : 0) * 0.65;

			// Recycle chunks that have fallen behind or ahead
			this.chunks.forEach((chunk) => {
				if (this.camX > chunk.originX + this.CHUNK_W + 160) {
					chunk.originX += 2 * this.CHUNK_W;
					this.updateChunk(chunk);
				} else if (this.camX < chunk.originX - 160) {
					chunk.originX -= 2 * this.CHUNK_W;
					this.updateChunk(chunk);
				}
			});
		} else {
			// 2. CONTACT ARRIVAL PHASE (Looping halted, castles rendered on track ahead)
			if (!this.castlePlaced) {
				this.castlePlaced = true;
				this.lockedLoopCamX = this.camX;
				const baseX = Math.round(this.camX + this.W * 0.45 + 110);
				this.castleBaseX = baseX;
				this.castle1.position.x = baseX;
				this.castle2.position.x = baseX + this.castleSpacing;
				this.castle1.visible = true;
				this.castle2.visible = true;

				// Clear away loop obstacles from the castle runway
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

		// Castle interaction overrides
		if (this.currentCastle === 'castle2') {
			targetCamX = this.castle2.position.x;
		} else if (this.currentCastle === 'castle1') {
			targetCamX = this.castle1.position.x;
		}

		// Smooth camera tracking with strict velocity clamping
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

		// Infinite ground tracking
		this.groundG.position.x = Math.round(this.camX / 16) * 16;

		// Background parallax wrapping
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

		// Mario position and animation
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

				// Calculate jump arc with smooth cosine bell curve and generous span
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
				// Smooth vertical interpolation prevents hard snaps or sudden drops
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
						// 1. Fase naik (Rise / Punch up)
						this.mario.material.map = this.marioT.jump;
					} else if (jumpProgress <= 0.62) {
						// 2. Fase puncak melayang (Apex float / hover transition)
						this.mario.material.map = this.marioT.apex;
					} else {
						// 3. Fase meluncur turun (Smooth fall descent)
						this.mario.material.map = this.marioT.fall;
					}
				} else {
					this.mario.material.map =
						this.t - this.moving < 8 && !isAtCastleStop
							? Math.floor(this.t / 5) % 2
								? this.marioT.w1
								: this.marioT.w2
							: this.marioT.stand;
				}
			} else {
				this.mario.visible = false;
				if (contactProgress < 0.3) {
					this.currentCastle = 'outside';
					this.mario.visible = true;
					this.mario.material.opacity = 1;
				}
			}

			// Check block hits
			this.qs.forEach((b) => {
				if (b.visible) {
					const dx = Math.abs(this.mario.position.x - b.position.x);
					if (dx < 8 && this.mario.position.y >= 64 && this.mario.visible) this.hit(b);
					else if (dx > 40) b.userData.cool = false;
					b.position.y = b.userData.y + Math.round(b.userData.off);
				}
			});

			// Check item collections
			this.items.forEach((s) => {
				if (!s.visible || s.userData.got) return;
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
