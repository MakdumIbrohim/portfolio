import * as THREE from 'three';
import type { WorldChunk, WorldTextures } from './pixelTypes';

export function createSprite(
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
	if (parent) parent.add(s);
	return s;
}

export function buildScenery(
	scene: THREE.Scene,
	tex: WorldTextures
): {
	cloudG: THREE.Group;
	hillG: THREE.Group;
	bushG: THREE.Group;
	groundG: THREE.Group;
	worldG: THREE.Group;
	groundMesh: THREE.Mesh;
} {
	const grp = () => {
		const g = new THREE.Group();
		scene.add(g);
		return g;
	};

	const cloudG = grp();
	const hillG = grp();
	const bushG = grp();
	const worldG = grp();
	const groundG = grp();

	for (let i = 0; i < 20; i++) {
		const s = createSprite(tex.cloud, 32, 24, -800 + i * 160, -30 - (i % 3) * 20, 1, cloudG);
		s.userData.baseX = -800 + i * 160;
	}
	for (let i = 0; i < 16; i++) {
		const s = createSprite(tex.hill, 80, 40, -800 + i * 260, 20 + 32, 2, hillG);
		s.userData.baseX = -800 + i * 260;
	}
	for (let i = 0; i < 18; i++) {
		const s = createSprite(tex.bush, 32, 16, -800 + i * 280, 32 + 8, 3, bushG);
		s.userData.baseX = -800 + i * 280;
	}

	const groundWidth = 6400;
	const gt = tex.brick.clone();
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
	groundG.add(groundMesh);

	return { cloudG, hillG, bushG, groundG, worldG, groundMesh };
}

export function buildChunk(
	originX: number,
	chunkIdx: number,
	tex: WorldTextures,
	worldG: THREE.Group,
	onRegisterQ: (s: THREE.Sprite) => void,
	onRegisterItem: (s: THREE.Sprite) => void
): WorldChunk {
	const items: THREE.Sprite[] = [];

	[
		[320, 32],
		[720, 48],
		[1080, 64]
	].forEach(([relX, h]) => {
		const pipe = createSprite(tex.pipe(h), 32, h, originX + relX, 32 + h / 2, 4, worldG);
		pipe.userData.relX = relX;
		pipe.userData.chunkIdx = chunkIdx;
		items.push(pipe);
	});

	[160, 540, 920].forEach((relX) => {
		const bLeft = createSprite(tex.brick, 16, 16, originX + relX - 16, 88, 5, worldG);
		bLeft.userData.relX = relX - 16;
		bLeft.userData.chunkIdx = chunkIdx;
		items.push(bLeft);

		const bRight = createSprite(tex.brick, 16, 16, originX + relX + 16, 88, 5, worldG);
		bRight.userData.relX = relX + 16;
		bRight.userData.chunkIdx = chunkIdx;
		items.push(bRight);

		const q = createSprite(tex.qBlock, 16, 16, originX + relX, 88, 5, worldG);
		q.userData.relX = relX;
		q.userData.chunkIdx = chunkIdx;
		q.userData.cool = false;
		items.push(q);
		onRegisterQ(q);
	});

	[80, 240, 400, 480, 640, 780, 860, 1000].forEach((relX, j) => {
		const coinY = 32 + 14 + Math.round(Math.sin((j + chunkIdx * 3) * 0.9) * 16) + 20;
		const coin = createSprite(tex.coins[0], 8, 14, originX + relX, coinY, 5, worldG);
		coin.userData.relX = relX;
		coin.userData.baseY = coinY;
		coin.userData.kind = 'coin';
		coin.userData.i = j;
		coin.userData.chunkIdx = chunkIdx;
		items.push(coin);
		onRegisterItem(coin);
	});

	const mush = createSprite(tex.mush, 16, 16, originX + 440, 40, 5, worldG);
	mush.userData.relX = 440;
	mush.userData.baseY = 40;
	mush.userData.kind = 'mush';
	mush.userData.chunkIdx = chunkIdx;
	items.push(mush);
	onRegisterItem(mush);

	return { originX, items };
}

export function updateChunk(chunk: WorldChunk) {
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
