<script lang="ts">
	interface Props {
		email: string;
		github: string;
		linkedin: string;
		instagram: string;
		onConnect: (url: string) => void;
	}

	let { email, github, linkedin, instagram, onConnect }: Props = $props();

	const emailSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;
	const githubSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`;
	const linkedinSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
	const instagramSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;

	let contacts = $derived([
		{ label: 'Email', val: email, url: `mailto:${email}`, icon: emailSvg },
		{ label: 'GitHub', val: '@makdumibrohim', url: github, icon: githubSvg },
		{ label: 'LinkedIn', val: '/in/makdumibrohim', url: linkedin, icon: linkedinSvg },
		{ label: 'Instagram', val: '@makdumibrohim', url: instagram, icon: instagramSvg }
	]);
</script>

<section id="contact">
	<h2 class="rv">FINAL STAGE · CONTACT</h2>
	<div class="panel castle rv">
		<p class="intro">
			Kamu sudah sampai di kastil! Klik pintu koneksi untuk memasukkan Mario ke dalam kastil dan membuka
			komunikasi.
		</p>

		<div class="links-grid">
			{#each contacts as c}
				<button
					type="button"
					class="link-item"
					onclick={() => onConnect(c.url)}
					title="Masuk ke {c.label}"
				>
					<span class="ico">{@html c.icon}</span>
					<div class="info">
						<span class="platform-label">{c.label}</span>
						<span class="platform-val">{c.val}</span>
					</div>
					<span class="enter-badge px">ENTER 🏰</span>
				</button>
			{/each}
		</div>

		<button
			type="button"
			class="btn hello-btn"
			onclick={() => onConnect(`mailto:${email}`)}
		>
			Say Hello 👑
		</button>
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
		padding: 24px 20px;
	}

	.castle {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.intro {
		font-family: 'VT323', 'Courier New', monospace;
		font-size: 22px;
		line-height: 1.35;
		margin: 0 0 6px;
		color: #ffffff;
	}

	.links-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 12px;
	}

	.link-item {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #242442;
		border: 3px solid #000;
		box-shadow: 0 4px 0 #0f0f1c;
		padding: 12px 14px;
		color: #ffffff;
		text-decoration: none;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		transition:
			transform 0.08s,
			box-shadow 0.08s,
			background 0.15s;
	}

	.link-item:hover {
		transform: translateY(-3px);
		box-shadow: 0 7px 0 #0f0f1c;
		background: #2e2e54;
		border-color: #fbd000;
	}

	.link-item .ico {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		color: #fbd000;
		flex-shrink: 0;
	}

	.link-item .ico :global(svg) {
		width: 24px;
		height: 24px;
	}

	.info {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}

	.platform-label {
		font: 10px 'Press Start 2P', monospace;
		color: #fbd000;
		margin-bottom: 4px;
	}

	.platform-val {
		font: 18px 'VT323', monospace;
		color: #e2e8f0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.enter-badge {
		font: 8px 'Press Start 2P', monospace;
		background: #b5651d;
		color: #fff;
		padding: 5px 6px;
		border: 2px solid #000;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.link-item:hover .enter-badge {
		background: #43b047;
	}

	.hello-btn {
		display: inline-block;
		font: 11px 'Press Start 2P', monospace;
		padding: 14px 20px;
		text-decoration: none;
		color: #fff;
		background: #e52521;
		border: 4px solid #000;
		box-shadow: 0 6px 0 #7a1411;
		cursor: pointer;
		align-self: flex-start;
		margin-top: 6px;
		transition:
			transform 0.08s,
			box-shadow 0.08s;
	}

	.hello-btn:hover,
	.hello-btn:focus-visible {
		transform: translateY(3px);
		box-shadow: 0 3px 0 #7a1411;
		outline: none;
	}

	@media (max-width: 600px) {
		section {
			padding: 90px 14px 140px;
		}
		.links-grid {
			grid-template-columns: 1fr;
		}
		.intro {
			font-size: 19px;
		}
		.hello-btn {
			font-size: 10px;
			padding: 12px 14px;
			width: 100%;
			text-align: center;
		}
	}
</style>
