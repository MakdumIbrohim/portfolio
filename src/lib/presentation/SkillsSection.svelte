<script lang="ts">
	import type { TechItem } from '../domain/portfolio';
	import { sound } from '../infrastructure/audio/retroAudio';

	interface Props {
		items: TechItem[];
		onItemClick: (e: MouseEvent) => void;
	}

	let { items, onItemClick }: Props = $props();

	let collected = $state<Record<string, boolean>>({});

	function handleItemClick(name: string, e: MouseEvent) {
		if (!collected[name]) {
			collected[name] = true;
			sound.playPowerUp();
			onItemClick(e);
		} else {
			sound.playBump();
		}
	}
</script>

<section id="skills">
	<h2 class="rv">POWER-UPS · TEKNOLOGI</h2>
	<p class="rv hint">Klik item untuk mengumpulkan koin.</p>
	<div class="grid rv" id="inv">
		{#each items as item}
			<button
				class="item {collected[item.name] ? 'got' : ''}"
				onclick={(e) => handleItemClick(item.name, e)}
			>
				<span class="ico">{@html item.icon}</span>
				{item.name}
			</button>
		{/each}
	</div>
</section>

<style>
	section {
		min-height: 100vh;
		padding: 110px 20px 190px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 1000px;
		margin: 0 auto;
	}

	h2 {
		font-family: 'Press Start 2P', monospace;
		font-size: clamp(14px, 3vw, 22px);
		margin: 0 0 20px;
		text-shadow: 3px 3px 0 #000;
		color: #ffffff;
		line-height: 1.5;
	}

	.hint {
		font-family: 'VT323', 'Courier New', monospace;
		font-size: 22px;
		margin-top: -8px;
		color: #ffffff;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 14px;
	}

	.item {
		background: #b5651d;
		border: 4px solid #000;
		padding: 14px 8px;
		text-align: center;
		font: 10px 'Press Start 2P', monospace;
		color: #ffffff;
		cursor: pointer;
		position: relative;
		user-select: none;
		transition: transform 0.1s;
	}

	.item:hover {
		transform: translateY(-4px);
	}

	.item .ico {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 44px;
		margin-bottom: 10px;
		color: #fbd000;
	}

	.item .ico :global(svg) {
		width: 36px;
		height: 36px;
		display: block;
		transition: transform 0.1s;
	}

	.item:hover .ico :global(svg) {
		transform: scale(1.12);
	}

	.item.got {
		background: #43b047;
	}

	.item.got .ico {
		color: #ffffff;
	}

	@media (max-width: 600px) {
		section {
			padding: 70px 12px 100px;
		}
		.grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 10px;
		}
		.item {
			padding: 14px 6px;
			font-size: 9px;
		}
		.item .ico {
			height: 36px;
			margin-bottom: 8px;
		}
		.item .ico :global(svg) {
			width: 30px;
			height: 30px;
		}
	}
</style>
