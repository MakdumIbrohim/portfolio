<script lang="ts">
	interface Props {
		about: string[];
	}

	let { about }: Props = $props();
</script>

<section id="about">
	<h2 class="rv">MUSHROOM KINGDOM · ABOUT ME</h2>
	<div class="panel rv">
		{#each about as paragraph}
			<p>{paragraph}</p>
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

	p {
		font-family: 'VT323', 'Courier New', monospace;
		font-size: 22px;
		line-height: 1.4;
		margin: 0 0 14px;
		color: #ffffff;
	}

	p:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 600px) {
		section {
			padding-top: 100px;
		}
	}
</style>
