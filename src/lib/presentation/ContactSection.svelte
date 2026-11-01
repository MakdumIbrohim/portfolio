<script lang="ts">
	interface Props {
		email: string;
		github: string;
		linkedin: string;
		instagram: string;
		duolingo?: string;
		onConnect: (url: string) => void;
	}

	let {
		email,
		github,
		linkedin,
		instagram,
		duolingo = 'https://www.duolingo.com/profile/makdumibrohim',
		onConnect
	}: Props = $props();

	const emailSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;
	const githubSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`;
	const linkedinSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
	const instagramSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;
	const duolingoSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M14.484 18.213c1.142 1.033 2.657 1.662 4.316 1.662l.294-.001c1.985-.038 3.749-.976 4.905-2.422v1.98c0 2.522-2.043 4.568-4.567 4.568H4.569C2.045 23.998.002 21.954.002 19.43v-1.92c1.181 1.443 2.976 2.365 4.985 2.365l.35-.001c1.61-.027 3.076-.646 4.191-1.648.555.764 1.456 1.26 2.473 1.26 1.023 0 1.928-.502 2.483-1.273zm-5.349-.996c-.989 1.022-2.375 1.658-3.909 1.658h-.239c-2.229 0-4.146-1.343-4.987-3.262v-7.16c.281-.64.68-1.216 1.169-1.699-.035-.731.132-1.469.511-2.128.256-.44.867-.504 1.21-.124l.766.851c.007-.003.014-.003.021-.005-.098-.78.037-1.587.419-2.308.24-.45.757-.53 1.114-.164 0 0 3.939 3.979 4.035 4.084 1.542 1.348 4.066 1.287 5.686-.18.002-.003.007-.005.009-.007.042-.042 3.855-3.9 3.855-3.9.3361-.3451.8619-.3101 1.113.164.385.724.518 1.535.417 2.32.002.001.003.001.004.002l.007.002c.001 0 .002 0 .003.001l.776-.86c.342-.38.954-.316 1.207.124.387.673.553 1.427.509 2.173.496.501.897 1.099 1.169 1.762v6.941c-.816 1.978-2.761 3.373-5.032 3.373H18.8c-1.547 0-2.945-.648-3.936-1.686a.8386.8386 0 0 0-.009-.067c.313-.017.528-.162.688-.33.152-.16.299-.397.299-.776 0 0-.022-.312-.024-.324.693.767 1.696 1.249 2.811 1.249 2.092 0 3.787-1.696 3.787-3.787v-2.243c0-2.092-1.697-3.787-3.787-3.787-2.093 0-3.787 1.695-3.787 3.787v2.243c0 .266.027.526.079.776-.712-.784-1.744-1.278-2.842-1.278-1.239 0-2.339.523-3.064 1.355.063-.274.097-.56.097-.853v-2.243c0-2.092-1.697-3.787-3.788-3.787-2.09 0-3.787 1.695-3.787 3.787v2.243c0 2.093 1.697 3.787 3.787 3.787 1.151 0 2.182-.513 2.876-1.322-.008.035-.039.395-.039.395 0 .378.147.616.298.775.16.168.374.312.688.331a.7783.7783 0 0 0-.012.097zm.997.073c.729.131 1.733.305 1.792.305h.157c.059 0 1.789-.303 1.789-.303-.327.705-1.041 1.194-1.869 1.194-.829 0-1.543-.49-1.869-1.196zm-.971-1.379c.246-1.313 1.462-2.259 2.918-2.259 1.324 0 2.521.97 2.763 2.259v.105c0 .082-.029.115-.103.106l-2.658.473h-.157l-2.66-.476c-.075.01-.103-.023-.103-.105Zm8.023-6.392c.255-.14.549-.22.861-.22.992 0 1.798.804 1.798 1.798v1.919c0 .991-.804 1.797-1.798 1.797-.991 0-1.797-.803-1.797-1.797v-1.542c.034.003.068.005.103.005.64 0 1.16-.518 1.16-1.156 0-.312-.125-.596-.327-.804zM5.162 9.461c.227-.104.48-.162.746-.162.991 0 1.798.804 1.798 1.798v1.919c0 .991-.804 1.797-1.798 1.797-.991 0-1.797-.803-1.797-1.797v-1.571c.089.022.182.034.278.034.641 0 1.16-.518 1.16-1.156 0-.342-.149-.65-.387-.862ZM.002 6.554V4.568C.002 2.044 2.045 0 4.569 0h14.865c2.522 0 4.565 2.044 4.565 4.568v2.041a5.1847 5.1847 0 0 0-.164-.197 4.8592 4.8592 0 0 0-.646-2.284c-.433-.754-1.315-1.037-2.07-.786a4.785 4.785 0 0 0-.327-.774h-.001c-.287-.54-.758-.835-1.248-.908-.493-.073-1.033.072-1.464.515l-3.82 3.864c-1.226 1.11-3.127 1.199-4.313.205-.103-.109-4.025-4.071-4.025-4.071-.427-.438-.966-.584-1.46-.51-.489.073-.961.367-1.248.907v.002c-.133.25-.241.508-.327.771-.753-.252-1.635.029-2.071.782 0 0-.001.001-.001.002-.4.694-.613 1.459-.645 2.23-.057.065-.113.13-.167.197z"/></svg>`;

	let contacts = $derived([
		{ label: 'Email', val: email, url: `mailto:${email}`, icon: emailSvg },
		{ label: 'GitHub', val: '@makdumibrohim', url: github, icon: githubSvg },
		{ label: 'LinkedIn', val: '/in/makdum-ibrohim', url: linkedin, icon: linkedinSvg },
		{ label: 'Instagram', val: '@mkdmibrhm_', url: instagram, icon: instagramSvg },
		{ label: 'Duolingo', val: '@makdumibrohim', url: duolingo, icon: duolingoSvg }
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
					<span class="enter-badge px">ENTER</span>
				</button>
			{/each}
		</div>

		<button
			type="button"
			class="btn hello-btn"
			onclick={() => onConnect(`mailto:${email}`)}
		>
			Say Hello
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
		background: #8c3e06;
		color: #ffffff;
		padding: 6px 8px;
		border: 2px solid #000;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.link-item:hover .enter-badge {
		background: #1b7a20;
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
			padding: 70px 12px 100px;
		}
		.panel {
			padding: 16px 12px;
		}
		.links-grid {
			grid-template-columns: 1fr;
			gap: 8px;
		}
		.link-item {
			padding: 10px 10px;
		}
		.intro {
			font-size: 18px;
		}
		.hello-btn {
			font-size: 10px;
			padding: 12px 14px;
			width: 100%;
			text-align: center;
		}
	}
</style>
