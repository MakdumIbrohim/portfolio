<script lang="ts">
	import { sound } from '../infrastructure/audio/retroAudio';

	interface Props {
		coins: number;
	}

	let { coins }: Props = $props();
	let isMuted = $state(false);
	let menuOpen = $state(false);

	function toggleAudio() {
		isMuted = sound.toggleMute();
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
		sound.playJump();
	}

	function closeMenu() {
		menuOpen = false;
	}
</script>

<header>
	<div class="hud-left">
		<span class="hud px">COIN ×<span>{String(coins).padStart(2, '0')}</span></span>
		<button
			class="sound-btn px"
			onclick={toggleAudio}
			aria-label="Toggle Sound"
			title="Toggle Audio"
		>
			{isMuted ? '♪ OFF' : '♪ ON'}
		</button>
	</div>

	<button class="menu-toggle px" onclick={toggleMenu} aria-label="Toggle Navigation">
		{menuOpen ? '✕' : '☰ MENU'}
	</button>

	<nav class={menuOpen ? 'open' : ''} aria-label="Navigasi utama">
		<a href="#home" onclick={closeMenu}>Start</a>
		<a href="#about" onclick={closeMenu}>About</a>
		<a href="#skills" onclick={closeMenu}>Items</a>
		<a href="#projects" onclick={closeMenu}>Stages</a>
		<a href="#journey" onclick={closeMenu}>Journey</a>
		<a href="#contact" onclick={closeMenu}>Castle</a>
	</nav>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		padding: 8px 14px;
		padding-top: calc(8px + env(safe-area-inset-top, 0px));
		background: #1a1a2e;
		border-bottom: 4px solid #000;
	}

	.hud-left {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}

	header .hud {
		font: 10px 'Press Start 2P', monospace;
		color: #ffffff;
		white-space: nowrap;
	}

	.sound-btn {
		font: 9px 'Press Start 2P', monospace;
		background: #b5651d;
		color: #fbd000;
		border: 2px solid #000;
		padding: 5px 8px;
		cursor: pointer;
		user-select: none;
		white-space: nowrap;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		transition: transform 0.08s;
	}

	.sound-btn:hover {
		transform: translateY(-2px);
		background: #43b047;
		color: #ffffff;
	}

	.menu-toggle {
		display: none;
		font: 9px 'Press Start 2P', monospace;
		background: #1a1a2e;
		color: #fbd000;
		border: 2px solid #fbd000;
		padding: 6px 10px;
		cursor: pointer;
		white-space: nowrap;
	}

	nav {
		display: flex;
		gap: 4px;
		align-items: center;
	}

	nav a {
		font: 9px 'Press Start 2P', monospace;
		color: #ffffff;
		text-decoration: none;
		padding: 8px 8px;
		border: 2px solid transparent;
		white-space: nowrap;
	}

	nav a:hover,
	nav a:focus-visible {
		border-color: #fbd000;
		color: #fbd000;
		outline: none;
	}

	@media (max-width: 768px) {
		.menu-toggle {
			display: block;
		}

		nav {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			background: #1a1a2e;
			border-bottom: 4px solid #000;
			flex-direction: column;
			padding: 8px 12px 14px;
			gap: 6px;
			box-shadow: 0 8px 0 rgba(0, 0, 0, 0.4);
		}

		nav.open {
			display: flex;
		}

		nav a {
			width: 100%;
			padding: 10px 12px;
			background: rgba(255, 255, 255, 0.05);
			border: 2px solid #000;
		}

		nav a:hover {
			background: #b5651d;
			color: #fff;
			border-color: #fbd000;
		}
	}

	@media (max-width: 420px) {
		header .hud {
			font-size: 8px;
		}
		.sound-btn {
			font-size: 8px;
			padding: 4px 6px;
		}
		.menu-toggle {
			font-size: 8px;
			padding: 5px 8px;
		}
	}
</style>
