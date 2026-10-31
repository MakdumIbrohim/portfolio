<script lang="ts">
	import type { JourneyMilestone } from '../domain/portfolio';

	interface Props {
		milestones: JourneyMilestone[];
	}

	let { milestones }: Props = $props();
</script>

<section id="journey">
	<h2 class="rv">WORLD MAP · JOURNEY</h2>
	<div class="tl">
		{#each milestones as m}
			<div class="st rv panel">
				<h3>{m.level}</h3>
				<p>{m.desc}</p>
			</div>
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

	.panel {
		background: #1a1a2e;
		border: 4px solid #000;
		box-shadow:
			inset -4px -4px 0 #0008,
			inset 4px 4px 0 #fff2,
			6px 6px 0 #0006;
		padding: 20px;
	}

	.tl {
		position: relative;
		padding-left: 34px;
		border-left: 6px dashed #fbd000;
		margin-left: 8px;
	}

	.tl .st {
		position: relative;
		margin-bottom: 22px;
	}

	.tl .st::before {
		content: '';
		position: absolute;
		left: -46px;
		top: 6px;
		width: 20px;
		height: 20px;
		background: #fbd000;
		border: 4px solid #000;
	}

	.tl h3 {
		font-family: 'Press Start 2P', monospace;
		font-size: 11px;
		margin: 0 0 6px;
		color: #fbd000;
		line-height: 1.4;
	}

	p {
		font-family: 'VT323', 'Courier New', monospace;
		font-size: 22px;
		line-height: 1.35;
		margin: 0;
		color: #ffffff;
	}

	@media (max-width: 600px) {
		section {
			padding-top: 100px;
		}
	}
</style>
