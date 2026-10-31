<script lang="ts">
	import { sound } from '../infrastructure/audio/retroAudio';

	interface Props {
		coins: number;
	}

	let { coins }: Props = $props();
	let isMuted = $state(false);

	function toggleAudio() {
		isMuted = sound.toggleMute();
	}
</script>

<header>
	<div class="hud-left">
		<span class="hud px">COIN ×<span>{String(coins).padStart(2, '0')}</span></span>
		<button class="sound-btn px" onclick={toggleAudio} aria-label="Toggle Sound">
			{isMuted ? '♪ OFF' : '♪ ON'}
		</button>
	</div>
	<nav aria-label="Navigasi utama">
		<a href="#home">Start</a>
		<a href="#about">About</a>
		<a href="#skills">Items</a>
		<a href="#projects">Stages</a>
		<a href="#journey">Journey</a>
		<a href="#contact">Castle</a>
	</nav>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 20;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		padding-top: calc(10px + env(safe-area-inset-top, 0px));
		background: #1a1a2e;
		border-bottom: 4px solid #000;
	}

	.hud-left {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	header .hud {
		font: 10px 'Press Start 2P', monospace;
		color: #ffffff;
	}

	.sound-btn {
		font: 9px 'Press Start 2P', monospace;
		background: #b5651d;
		color: #fbd000;
		border: 2px solid #000;
		padding: 4px 8px;
		cursor: pointer;
		user-select: none;
		transition: transform 0.08s;
	}

	.sound-btn:hover {
		transform: translateY(-2px);
		background: #43b047;
		color: #ffffff;
	}

	nav {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
	}

	nav a {
		font: 9px 'Press Start 2P', monospace;
		color: #ffffff;
		text-decoration: none;
		padding: 8px 8px;
		border: 2px solid transparent;
	}

	nav a:hover,
	nav a:focus-visible {
		border-color: #fbd000;
		color: #fbd000;
		outline: none;
	}

	@media (max-width: 600px) {
		nav a {
			padding: 6px 5px;
			font-size: 8px;
		}
		header .hud {
			display: none;
		}
	}
</style>
