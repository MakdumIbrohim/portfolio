import * as THREE from 'three';
import type { MarioPoseTextures, MarioTextures, WorldTextures } from './pixelTypes';

export function createCanvasTexture(
	w: number,
	h: number,
	draw: (ctx: CanvasRenderingContext2D) => void
): THREE.CanvasTexture {
	const c = document.createElement('canvas');
	c.width = w;
	c.height = h;
	const ctx = c.getContext('2d')!;
	ctx.imageSmoothingEnabled = false;
	draw(ctx);
	const tex = new THREE.CanvasTexture(c);
	tex.magFilter = tex.minFilter = THREE.NearestFilter;
	tex.generateMipmaps = false;
	return tex;
}

export function textureFromMap(rows: string[], w: number, flipX = false): THREE.CanvasTexture {
	const PAL: Record<string, string> = {
		R: '#d82800',
		B: '#6c3b00',
		S: '#fc9838',
		W: '#fcfcfc',
		K: '#000000',
		Y: '#fcd800',
		T: '#fce0a8'
	};
	return createCanvasTexture(w, rows.length, (ctx) => {
		rows.forEach((r, y) => {
			const line = [...r.padEnd(w, '.')];
			if (flipX) line.reverse();
			line.forEach((char, i) => {
				if (char !== '.' && PAL[char]) {
					ctx.fillStyle = PAL[char];
					ctx.fillRect(i, y, 1, 1);
				}
			});
		});
	});
}

export function shapeTexture(
	w: number,
	h: number,
	inside: (a: number, b: number) => boolean,
	fill: string,
	edge: string,
	extra?: (ctx: CanvasRenderingContext2D) => void
): THREE.CanvasTexture {
	return createCanvasTexture(w, h, (ctx) => {
		const isInside = (a: number, b: number) => a >= 0 && b >= 0 && a < w && b < h && inside(a, b);
		for (let y = 0; y < h; y++) {
			for (let a = 0; a < w; a++) {
				if (!isInside(a, y)) continue;
				ctx.fillStyle =
					isInside(a - 1, y) && isInside(a + 1, y) && isInside(a, y - 1) && isInside(a, y + 1)
						? fill
						: edge;
				ctx.fillRect(a, y, 1, 1);
			}
		}
		if (extra) extra(ctx);
	});
}

export function createWorldTextures(): WorldTextures {
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

	const getPoses = (flip = false): MarioPoseTextures => ({
		stand: textureFromMap(top.concat(legs.stand), 12, flip),
		w1: textureFromMap(top.concat(legs.w1), 12, flip),
		w2: textureFromMap(top.concat(legs.w2), 12, flip),
		jump: textureFromMap(headRows.concat(jumpBody, legs.jump), 12, flip),
		apex: textureFromMap(headRows.concat(apexBody, legs.apex), 12, flip),
		fall: textureFromMap(headRows.concat(fallBody, legs.fall), 12, flip)
	});

	const marioRight = getPoses(false);
	const marioLeft = getPoses(true);

	const mario: MarioTextures = {
		...marioRight,
		left: marioLeft
	};

	const coins = [8, 6, 2, 6].map((w) =>
		createCanvasTexture(8, 14, (ctx) => {
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

	const cloud = shapeTexture(
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

	const bush = shapeTexture(
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

	const hill = shapeTexture(
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

	const qBlock = createCanvasTexture(16, 16, (x) => {
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

	const brick = createCanvasTexture(16, 16, (x) => {
		x.fillStyle = '#c84c0c';
		x.fillRect(0, 0, 16, 16);
		x.fillStyle = '#000';
		for (let r = 0; r < 4; r++) {
			x.fillRect(0, r * 4 + 3, 16, 1);
			(r % 2 ? [3, 11] : [7, 15]).forEach((v) => x.fillRect(v, r * 4, 1, 3));
		}
	});

	const mush = textureFromMap(
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

	const pipe = (h: number) =>
		createCanvasTexture(32, h, (x) => {
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

	const castle1 = createCanvasTexture(80, 72, (x) => {
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

	const castle2 = createCanvasTexture(88, 80, (x) => {
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

	return {
		cloud,
		bush,
		hill,
		qBlock,
		brick,
		mush,
		pipe,
		castle1,
		castle2,
		mario,
		coins
	};
}
