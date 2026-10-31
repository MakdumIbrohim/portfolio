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
			<svg class="hud-icon" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
				{#if isMuted}
					<path
						d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
					/>
				{:else}
					<path
						d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
					/>
				{/if}
			</svg>
			<span>{isMuted ? 'OFF' : 'ON'}</span>
		</button>
	</div>

	<button class="menu-toggle px" onclick={toggleMenu} aria-label="Toggle Navigation">
		{#if menuOpen}
			<svg class="hud-icon" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
				<path
					d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
				/>
			</svg>
		{:else}
			<svg class="hud-icon" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
				<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
			</svg>
		{/if}
		<span>MENU</span>
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
		gap: 6px;
		line-height: 1;
		transition: transform 0.08s;
	}

	.sound-btn:hover {
		transform: translateY(-2px);
		background: #43b047;
		color: #ffffff;
	}

	.hud-icon {
		display: block;
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
		gap: 6px;
	}

	nav {
		display: flex;
		gap: 6px;
		align-items: center;
	}

	nav a,
	nav a:visited {
		font-family: 'Press Start 2P', 'Courier New', monospace;
		font-size: 9px;
		line-height: 1.4;
		color: #ffffff !important;
		text-decoration: none !important;
		padding: 6px 8px;
		border: 2px solid transparent;
		white-space: nowrap;
		display: inline-block;
		text-transform: uppercase;
	}

	nav a:hover,
	nav a:focus-visible {
		border-color: #fbd000;
		color: #fbd000 !important;
		text-decoration: none !important;
		outline: none;
	}

	@media (max-width: 768px) {
		.menu-toggle {
			display: inline-flex;
			align-items: center;
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

		nav a,
		nav a:visited {
			width: 100%;
			padding: 10px 12px;
			background: rgba(255, 255, 255, 0.05);
			border: 2px solid #000;
			color: #ffffff !important;
			text-decoration: none !important;
		}

		nav a:hover,
		nav a:focus-visible {
			background: #b5651d;
			color: #fbd000 !important;
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
