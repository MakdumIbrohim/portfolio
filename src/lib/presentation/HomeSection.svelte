<script lang="ts">
	import { sound } from '../infrastructure/audio/retroAudio';

	interface Props {
		world: string;
		name: string;
		title: string;
		bio: string;
	}

	let { world, name, title, bio }: Props = $props();
</script>

<section id="home">
	<div class="hero-txt panel rv">
		<p class="px stage-label">{world}</p>
		<h1>{name}</h1>
		<p class="px subtitle">{title}</p>
		<p class="bio">{bio}</p>
		<div class="actions">
			<a class="btn" href="#projects" onclick={() => sound.playJump()}>View My Projects</a>
			<a class="btn alt" href="#contact" onclick={() => sound.playJump()}>Contact Me</a>
		</div>
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

	.panel {
		background: #1a1a2e;
		border: 4px solid #000;
		box-shadow:
			inset -4px -4px 0 #0008,
			inset 4px 4px 0 #fff2,
			6px 6px 0 #0006;
		padding: 20px;
	}

	.hero-txt {
		max-width: 560px;
	}

	.stage-label {
		font-size: 10px;
		margin: 0 0 10px;
		font-family: 'Press Start 2P', monospace;
	}

	h1 {
		font-family: 'Press Start 2P', monospace;
		font-size: clamp(18px, 4.4vw, 34px);
		margin: 0 0 14px;
		text-shadow: 4px 4px 0 #000;
		color: #ffffff;
		line-height: 1.5;
	}

	.subtitle {
		font-family: 'Press Start 2P', monospace;
		font-size: 11px;
		color: #fbd000;
		margin: 0 0 14px;
		line-height: 1.5;
	}

	.bio {
		font-family: 'VT323', 'Courier New', monospace;
		font-size: 22px;
		line-height: 1.35;
		margin: 0 0 16px;
		color: #ffffff;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.btn {
		display: inline-block;
		font: 11px 'Press Start 2P', monospace;
		padding: 14px 16px;
		text-decoration: none;
		color: #fff;
		background: #e52521;
		border: 4px solid #000;
		box-shadow: 0 6px 0 #7a1411;
		cursor: pointer;
		transition:
			transform 0.08s,
			box-shadow 0.08s;
	}

	.btn:hover,
	.btn:focus-visible {
		transform: translateY(3px);
		box-shadow: 0 3px 0 #7a1411;
		outline: none;
	}

	.btn.alt {
		background: #43b047;
		box-shadow: 0 6px 0 #1f6b24;
	}

	.btn.alt:hover {
		box-shadow: 0 3px 0 #1f6b24;
	}

	@media (max-width: 600px) {
		section {
			padding: 70px 12px 100px;
		}
		.panel {
			padding: 16px 12px;
		}
		.bio {
			font-size: 18px;
		}
		.actions {
			flex-direction: column;
		}
		.btn {
			font-size: 9px;
			padding: 12px 12px;
			width: 100%;
			text-align: center;
			margin: 0;
		}
	}
</style>
