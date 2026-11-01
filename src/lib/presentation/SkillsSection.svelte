<script lang="ts">
	import type { TechItem } from '../domain/portfolio';
	import { sound } from '../infrastructure/audio/retroAudio';

	interface Props {
		items: TechItem[];
		onItemClick: (e: MouseEvent) => void;
	}

	let { items, onItemClick }: Props = $props();

	let collected = $state<Record<string, boolean>>({});
	let activeCategory = $state<'All' | 'Mobile & Frontend' | 'Backend & Database' | 'Tools & DevOps'>(
		'All'
	);

	let filteredItems = $derived(
		activeCategory === 'All'
			? items
			: items.filter((item) => item.category === activeCategory)
	);

	function handleItemClick(name: string, e: MouseEvent) {
		if (!collected[name]) {
			collected[name] = true;
			sound.playPowerUp();
			onItemClick(e);
		} else {
			sound.playBump();
		}
	}

	function selectCategory(cat: typeof activeCategory) {
		activeCategory = cat;
		sound.playJump();
	}
</script>

<section id="skills">
	<h2 class="rv">POWER-UPS · TEKNOLOGI</h2>
	<p class="rv hint">Klik item untuk mengumpulkan koin.</p>

	<div class="cat-tabs rv">
		<button
			type="button"
			class="tab-btn px {activeCategory === 'All' ? 'active' : ''}"
			onclick={() => selectCategory('All')}
		>
			ALL ({items.length})
		</button>
		<button
			type="button"
			class="tab-btn px {activeCategory === 'Mobile & Frontend' ? 'active' : ''}"
			onclick={() => selectCategory('Mobile & Frontend')}
		>
			MOBILE & FRONTEND
		</button>
		<button
			type="button"
			class="tab-btn px {activeCategory === 'Backend & Database' ? 'active' : ''}"
			onclick={() => selectCategory('Backend & Database')}
		>
			BACKEND & DB
		</button>
		<button
			type="button"
			class="tab-btn px {activeCategory === 'Tools & DevOps' ? 'active' : ''}"
			onclick={() => selectCategory('Tools & DevOps')}
		>
			TOOLS & DEVOPS
		</button>
	</div>

	<div class="grid rv" id="inv">
		{#each filteredItems as item}
			<button
				type="button"
				class="item {collected[item.name] ? 'got' : ''}"
				onclick={(e) => handleItemClick(item.name, e)}
				title={item.name}
			>
				<span class="ico">{@html item.icon}</span>
				<span class="item-name">{item.name}</span>
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

	.cat-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 20px;
	}

	.tab-btn {
		font: 8px 'Press Start 2P', monospace;
		background: #1a1a2e;
		color: #ffffff;
		border: 3px solid #000;
		box-shadow: 0 4px 0 #000;
		padding: 8px 12px;
		cursor: pointer;
		user-select: none;
		line-height: 1.4;
		transition:
			transform 0.08s,
			background 0.15s,
			color 0.15s;
	}

	.tab-btn:hover {
		transform: translateY(-2px);
		border-color: #fbd000;
		color: #fbd000;
	}

	.tab-btn.active {
		background: #fbd000;
		color: #000000;
		border-color: #000000;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 14px;
	}

	.item {
		background: #8c3e06;
		border: 4px solid #000;
		padding: 14px 8px;
		text-align: center;
		font: 10px 'Press Start 2P', monospace;
		color: #ffffff;
		cursor: pointer;
		position: relative;
		user-select: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 0 #0006;
		transition:
			transform 0.1s,
			background 0.15s;
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
		width: 32px;
		height: 32px;
		display: block;
		transition: transform 0.1s;
	}

	.item:hover .ico :global(svg) {
		transform: scale(1.12);
	}

	.item-name {
		word-break: break-word;
		line-height: 1.4;
	}

	.item.got {
		background: #1b7a20;
	}

	.item.got .ico {
		color: #ffffff;
	}

	@media (max-width: 600px) {
		section {
			padding: 70px 12px 100px;
		}
		.cat-tabs {
			gap: 6px;
		}
		.tab-btn {
			font-size: 7px;
			padding: 6px 8px;
		}
		.grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 10px;
		}
		.item {
			padding: 12px 6px;
			font-size: 8px;
		}
		.item .ico {
			height: 36px;
			margin-bottom: 8px;
		}
		.item .ico :global(svg) {
			width: 28px;
			height: 28px;
		}
	}
</style>
