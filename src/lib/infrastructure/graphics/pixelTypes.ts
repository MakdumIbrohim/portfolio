import type * as THREE from 'three';

export type CastleId = 'outside' | 'castle1' | 'castle2';

export interface WorldChunk {
	originX: number;
	items: THREE.Sprite[];
}

export interface MarioPoseTextures {
	stand: THREE.CanvasTexture;
	w1: THREE.CanvasTexture;
	w2: THREE.CanvasTexture;
	jump: THREE.CanvasTexture;
	apex: THREE.CanvasTexture;
	fall: THREE.CanvasTexture;
}

export interface MarioTextures extends MarioPoseTextures {
	left: MarioPoseTextures;
}

export interface WorldTextures {
	cloud: THREE.CanvasTexture;
	bush: THREE.CanvasTexture;
	hill: THREE.CanvasTexture;
	qBlock: THREE.CanvasTexture;
	brick: THREE.CanvasTexture;
	mush: THREE.CanvasTexture;
	pipe: (h: number) => THREE.CanvasTexture;
	castle1: THREE.CanvasTexture;
	castle2: THREE.CanvasTexture;
	mario: MarioTextures;
	coins: THREE.CanvasTexture[];
}
