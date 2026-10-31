<script lang="ts">
	import type { StageProject } from '../domain/portfolio';

	interface Props {
		projects: StageProject[];
	}

	let { projects }: Props = $props();
</script>

<section id="projects">
	<h2 class="rv">LEVEL SELECT · PROJECTS</h2>
	<div class="cards">
		{#each projects as p}
			<article class="card rv">
				<div class="th">{p.stage}</div>
				<div class="bd">
					<h3>{p.title}</h3>
					<p>{p.desc}</p>
					<div class="tags">
						{#each p.tags as t}
							<span>{t}</span>
						{/each}
					</div>
				</div>
				<div class="lk">
					<a href={p.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
					<a href={p.demoUrl} target="_blank" rel="noreferrer">Live Demo</a>
				</div>
			</article>
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

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 18px;
	}

	.card {
		background: #1a1a2e;
		border: 4px solid #000;
		box-shadow: 6px 6px 0 #0006;
		display: flex;
		flex-direction: column;
	}

	.card .th {
		height: 120px;
		background: repeating-linear-gradient(45deg, #2a2a4a 0 10px, #33335a 10px 20px);
		display: grid;
		place-items: center;
		font: 10px 'Press Start 2P', monospace;
		color: #fbd000;
		border-bottom: 4px solid #000;
	}

	.card .bd {
		padding: 14px;
		flex: 1;
	}

	.card h3 {
		font-family: 'Press Start 2P', monospace;
		font-size: 12px;
		margin: 0 0 8px;
		color: #fbd000;
		line-height: 1.4;
	}

	p {
		font-family: 'VT323', 'Courier New', monospace;
		font-size: 20px;
		line-height: 1.35;
		margin: 0;
		color: #ffffff;
	}

	.tags span {
		display: inline-block;
		font: 8px 'Press Start 2P', monospace;
		background: #e52521;
		color: #ffffff;
		padding: 5px 6px;
		margin: 6px 4px 0 0;
	}

	.card .lk {
		padding: 0 14px 14px;
	}

	.card .lk a {
		font: 9px 'Press Start 2P', monospace;
		color: #ffffff;
		margin-right: 12px;
		text-decoration: none;
	}

	.card .lk a:hover {
		color: #fbd000;
	}

	@media (max-width: 600px) {
		section {
			padding: 70px 12px 100px;
		}
		.cards {
			grid-template-columns: 1fr;
			gap: 14px;
		}
		.card .th {
			height: 90px;
		}
	}
</style>
