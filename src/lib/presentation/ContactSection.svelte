<script lang="ts">
	import { sound } from '../infrastructure/audio/retroAudio';

	interface Props {
		email: string;
		github: string;
		linkedin: string;
		instagram: string;
	}

	let { email, github, linkedin, instagram }: Props = $props();
</script>

<section id="contact">
	<h2 class="rv">FINAL STAGE · CONTACT</h2>
	<div class="panel castle rv">
		<p style="margin-top:0">
			Kamu sudah sampai di kastil. Ayo ngobrol soal project atau kesempatan kerja.
		</p>
		<div class="links">
			<a href="mailto:{email}">Email · {email}</a>
			<a href={github} target="_blank" rel="noreferrer">GitHub · @makdumibrohim</a>
			<a href={linkedin} target="_blank" rel="noreferrer">LinkedIn · /in/makdumibrohim</a>
			<a href={instagram} target="_blank" rel="noreferrer">Instagram · @makdumibrohim</a>
		</div>
		<a class="btn" href="mailto:{email}" onclick={() => sound.playStageClear()}>Say Hello</a>
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

	.castle {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	p {
		font-family: 'VT323', 'Courier New', monospace;
		font-size: 22px;
		line-height: 1.35;
		margin: 0 0 14px;
		color: #ffffff;
	}

	.links a {
		display: block;
		color: #fff;
		text-decoration: none;
		font: 11px 'Press Start 2P', monospace;
		padding: 12px 0;
		border-bottom: 2px dashed rgba(255, 255, 255, 0.25);
		line-height: 1.4;
	}

	.links a:hover {
		color: #fbd000;
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
		align-self: flex-start;
		margin-top: 14px;
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

	@media (max-width: 600px) {
		section {
			padding: 90px 14px 140px;
		}
		.links a {
			font-size: 9px;
			word-break: break-all;
			padding: 10px 0;
		}
		.btn {
			font-size: 10px;
			padding: 12px 14px;
		}
	}
</style>
