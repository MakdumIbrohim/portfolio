<script lang="ts">
	import { sound } from '../infrastructure/audio/retroAudio';

	interface Props {
		world: string;
		name: string;
		title: string;
		bio: string;
		avatarUrl?: string;
	}

	let { world, name, title, bio, avatarUrl }: Props = $props();
</script>

<section id="home">
	<div class="hero-card panel rv">
		<div class="p1-badge px">
			<span class="p1-indicator"></span>
			PLAYER 1 · SELECT
		</div>

		<div class="hero-content">
			<div class="avatar-box">
				<div class="avatar-frame">
					<img
						src={avatarUrl || '/avatar.svg'}
						alt={name}
						class="avatar-img"
						onerror={(e) => {
							const target = e.currentTarget as HTMLImageElement;
							target.src = '/avatar.svg';
						}}
					/>
				</div>
				<div class="avatar-caption px">READY</div>
			</div>

			<div class="hero-info">
				<p class="px stage-label">{world}</p>
				<h1>{name}</h1>
				<p class="px subtitle">{title}</p>
				<p class="bio">{bio}</p>
				<div class="actions">
					<a class="btn" href="#projects" onclick={() => sound.playJump()}>View My Projects</a>
					<a class="btn alt" href="#contact" onclick={() => sound.playJump()}>Contact Me</a>
				</div>
			</div>
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
		padding: 22px;
	}

	.hero-card {
		max-width: 680px;
	}

	.p1-badge {
		font-size: 9px;
		color: #fbd000;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 16px;
		padding-bottom: 8px;
		border-bottom: 2px dashed rgba(251, 208, 0, 0.35);
		width: 100%;
	}

	.p1-indicator {
		width: 8px;
		height: 8px;
		background: #43b047;
		border: 1px solid #000;
		animation: blink 1.2s infinite steps(2);
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.2;
		}
	}

	.hero-content {
		display: flex;
		align-items: flex-start;
		gap: 24px;
	}

	.avatar-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
	}

	.avatar-frame {
		width: 112px;
		height: 112px;
		background: #000000;
		border: 4px solid #000000;
		outline: 3px solid #fbd000;
		box-shadow: 4px 4px 0 #000000;
		overflow: hidden;
		position: relative;
	}

	.avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		image-rendering: pixelated;
	}

	.avatar-caption {
		font-size: 8px;
		color: #43b047;
		background: #1a1a2e;
		padding: 3px 6px;
		border: 2px solid #000;
	}

	.hero-info {
		flex: 1;
		min-width: 0;
	}

	.stage-label {
		font-size: 10px;
		margin: 0 0 8px;
		font-family: 'Press Start 2P', monospace;
	}

	h1 {
		font-family: 'Press Start 2P', monospace;
		font-size: clamp(18px, 4.4vw, 32px);
		margin: 0 0 12px;
		text-shadow: 4px 4px 0 #000;
		color: #ffffff;
		line-height: 1.4;
	}

	.subtitle {
		font-family: 'Press Start 2P', monospace;
		font-size: 11px;
		color: #fbd000;
		margin: 0 0 12px;
		line-height: 1.4;
	}

	.bio {
		font-family: 'VT323', 'Courier New', monospace;
		font-size: 22px;
		line-height: 1.35;
		margin: 0 0 18px;
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
		.hero-content {
			flex-direction: column;
			align-items: center;
			text-align: center;
			gap: 16px;
		}
		.avatar-frame {
			width: 96px;
			height: 96px;
		}
		.hero-info {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.bio {
			font-size: 18px;
		}
		.actions {
			flex-direction: column;
			width: 100%;
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
