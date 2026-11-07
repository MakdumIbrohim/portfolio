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

export interface StarData {
	sprite: THREE.Sprite;
	baseX: number;
	baseY: number;
	speed: number;
	phase: number;
	baseOpacity: number;
	amp: number;
	isTwinkle: boolean;
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
	moon: THREE.CanvasTexture;
	starDot: THREE.CanvasTexture;
	starCross: THREE.CanvasTexture;
	starSparkle: THREE.CanvasTexture;
	starDiamond: THREE.CanvasTexture;
	mario: MarioTextures;
	coins: THREE.CanvasTexture[];
}
