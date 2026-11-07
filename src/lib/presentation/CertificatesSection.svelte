<script lang="ts">
	import type { Certificate } from '../domain/portfolio';
	import { sound } from '../infrastructure/audio/retroAudio';

	interface Props {
		certificates: Certificate[];
	}

	let { certificates }: Props = $props();

	const starSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fbd000"><path d="M12 1.5l2.8 6.7 7.2.6-5.4 4.8 1.6 7.1-6.2-3.8-6.2 3.8 1.6-7.1-5.4-4.8 7.2-.6z"/></svg>`;
	const trophySvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fbd000"><path d="M19 3H5v6a7 7 0 0 0 6 6.92V19H8v2h8v-2h-3v-3.08A7 7 0 0 0 19 9V3zm-2 6a5 5 0 0 1-10 0V5h10v4zM3 5h2v4a7 7 0 0 0 1.05 3.65L4.5 14A7 7 0 0 1 3 9V5zm18 0v4a7 7 0 0 1-1.5 5l-1.55-1.35A7 7 0 0 0 21 9V5h-2v-.01z"/></svg>`;
	const medalSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fbd000"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V22l4-2 4 2v-7.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm-2 14.09l2-1 2 1v1.64l-2-1-2 1v-1.64z"/></svg>`;

	function getBadgeSvg(badge: Certificate['badge']) {
		switch (badge) {
			case 'TROPHY':
				return trophySvg;
			case 'MEDAL':
				return medalSvg;
			default:
				return starSvg;
		}
	}
</script>

<section id="certificates">
	<h2 class="rv">TROPHY ROOM · CERTIFICATES</h2>
	<p class="rv hint">Lisensi & sertifikasi kompetensi terverifikasi.</p>

	<div class="trophy-grid">
		{#each certificates as c}
			<article class="trophy-card panel rv">
				<div class="card-top">
					<span class="badge-icon" aria-hidden="true">
						{@html getBadgeSvg(c.badge)}
					</span>
					<span class="cert-date">{c.date}</span>
				</div>

				<div class="card-body">
					<h3 class="cert-title">{c.title}</h3>
					<p class="cert-issuer">{c.issuer}</p>

					<div class="tags">
						{#each c.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				</div>

				<div class="card-action">
					<a
						class="verify-btn"
						href={c.credentialUrl}
						target="_blank"
						rel="noreferrer"
						onclick={() => sound.playPowerUp()}
					>
						Verify
						<svg class="ext-ico" viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
							<path d="M14 2H8v2h3.59L6.29 9.29l1.42 1.42L13 5.41V9h2V2h-1zM4 4h3V2H2v12h12V9h-2v3H4V4z" />
						</svg>
					</a>
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

	.hint {
		font-family: 'VT323', 'Courier New', monospace;
		font-size: 22px;
		margin-top: -8px;
		margin-bottom: 24px;
		color: #ffffff;
	}

	.trophy-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 18px;
	}

	.panel {
		background: #1a1a2e;
		border: 4px solid #000;
		box-shadow:
			inset -4px -4px 0 #0008,
			inset 4px 4px 0 #fff2,
			6px 6px 0 #0006;
		padding: 18px;
	}

	.trophy-card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: transform 0.1s, border-color 0.1s;
	}

	.trophy-card:hover {
		transform: translateY(-4px);
		border-color: #fbd000;
	}

	.card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
		padding-bottom: 8px;
		border-bottom: 2px dashed rgba(251, 208, 0, 0.3);
	}

	.badge-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cert-date {
		font: 9px 'Press Start 2P', monospace;
		color: #fbd000;
	}

	.card-body {
		flex: 1;
		margin-bottom: 16px;
	}

	.cert-title {
		font-family: 'Press Start 2P', monospace;
		font-size: 11px;
		line-height: 1.45;
		margin: 0 0 8px;
		color: #ffffff;
	}

	.cert-issuer {
		font-family: 'VT323', monospace;
		font-size: 20px;
		color: #e2e8f0;
		margin: 0 0 12px;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.tag {
		font: 8px 'Press Start 2P', monospace;
		background: #8c3e06;
		color: #ffffff;
		padding: 4px 6px;
		border: 2px solid #000;
	}

	.card-action {
		display: flex;
		justify-content: flex-end;
		padding-top: 8px;
		border-top: 2px solid rgba(255, 255, 255, 0.08);
	}

	.verify-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font: 9px 'Press Start 2P', monospace;
		color: #ffffff;
		background: #1b7a20;
		border: 3px solid #000;
		box-shadow: 0 4px 0 #0d4a11;
		padding: 8px 12px;
		text-decoration: none;
		cursor: pointer;
		transition: transform 0.08s, box-shadow 0.08s;
	}

	.verify-btn:hover,
	.verify-btn:focus-visible {
		transform: translateY(2px);
		box-shadow: 0 2px 0 #0d4a11;
		border-color: #fbd000;
		color: #ffffff;
		outline: none;
	}

	.ext-ico {
		display: block;
	}

	@media (max-width: 600px) {
		section {
			padding: 70px 12px 100px;
		}

		.trophy-grid {
			grid-template-columns: 1fr;
			gap: 14px;
		}

		.cert-title {
			font-size: 10px;
		}

		.cert-issuer {
			font-size: 18px;
		}
	}
</style>
