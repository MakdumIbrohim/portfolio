<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import {
		PROFILE,
		TECH_ITEMS,
		STAGE_PROJECTS,
		CERTIFICATES_DATA,
		JOURNEY_LEVELS
	} from '../lib/domain/portfolio';
	import { PixelWorldEngine } from '../lib/infrastructure/graphics/pixelWorld';
	import LoadingScreen from '../lib/presentation/LoadingScreen.svelte';
	import HudHeader from '../lib/presentation/HudHeader.svelte';
	import HomeSection from '../lib/presentation/HomeSection.svelte';
	import AboutSection from '../lib/presentation/AboutSection.svelte';
	import SkillsSection from '../lib/presentation/SkillsSection.svelte';
	import ProjectsSection from '../lib/presentation/ProjectsSection.svelte';
	import CertificatesSection from '../lib/presentation/CertificatesSection.svelte';
	import JourneySection from '../lib/presentation/JourneySection.svelte';
	import ContactSection from '../lib/presentation/ContactSection.svelte';

	let canvas: HTMLCanvasElement;
	let engine: PixelWorldEngine | null = null;
	let coins = $state(0);

	function bumpCoin(x?: number, y?: number) {
		coins++;
		if (x == null || y == null) return;

		const f = document.createElement('div');
		f.className = 'coin-popup';
		f.textContent = '+1';
		f.style.left = x + 'px';
		f.style.top = y + 'px';
		document.body.appendChild(f);

		const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
		gsap.to(f, {
			y: -50,
			opacity: 0,
			duration: reduce ? 0.01 : 0.7,
			onComplete: () => f.remove()
		});
	}

	function handleConnect(url: string) {
		document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
		engine?.enterCastle(() => {
			if (url.startsWith('mailto:')) {
				window.location.href = url;
			} else {
				window.open(url, '_blank', 'noopener,noreferrer');
			}
		});
	}

	onMount(() => {
		engine = new PixelWorldEngine(canvas, bumpCoin);
		return () => {
			engine?.destroy();
		};
	});
</script>

<svelte:head>
	<title>{PROFILE.name} – {PROFILE.title}</title>
	<meta name="description" content="{PROFILE.bio}" />
</svelte:head>

<LoadingScreen />

<canvas id="bg" bind:this={canvas} aria-hidden="true"></canvas>

<HudHeader {coins} />

<main>
	<HomeSection
		world={PROFILE.world}
		name={PROFILE.name}
		title={PROFILE.title}
		bio={PROFILE.bio}
		avatarUrl={PROFILE.avatarUrl}
	/>

	<AboutSection about={PROFILE.about} />

	<SkillsSection items={TECH_ITEMS} onItemClick={(e) => bumpCoin(e.clientX, e.clientY)} />

	<ProjectsSection projects={STAGE_PROJECTS} />

	<CertificatesSection certificates={CERTIFICATES_DATA} />

	<JourneySection milestones={JOURNEY_LEVELS} />

	<ContactSection
		email={PROFILE.email}
		github={PROFILE.github}
		linkedin={PROFILE.linkedin}
		instagram={PROFILE.instagram}
		duolingo={PROFILE.duolingo}
		onConnect={handleConnect}
	/>
</main>

<style>
	:global(:root) {
		--sky: #5c94fc;
		--red: #e52521;
		--green: #43b047;
		--brick: #b5651d;
		--yellow: #fbd000;
		--white: #fff;
		--ink: #1a1a2e;
		box-sizing: border-box;
		padding-top: env(safe-area-inset-top, 0px);
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}

	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: inherit;
	}

	:global(html) {
		scroll-padding-top: env(safe-area-inset-top, 0px);
		scroll-behavior: auto;
	}

	:global(body) {
		margin: 0;
		background: var(--sky);
		color: var(--white);
		font-family: 'VT323', 'Courier New', monospace;
		font-size: 22px;
		line-height: 1.35;
		overflow-x: hidden;
	}

	:global(a),
	:global(a:visited),
	:global(a:link) {
		color: inherit;
		text-decoration: none;
	}

	:global(header nav a),
	:global(header nav a:visited),
	:global(header nav a:link) {
		font-family: 'Press Start 2P', 'Courier New', monospace !important;
		font-size: 9px !important;
		color: #ffffff !important;
		text-decoration: none !important;
		text-transform: uppercase !important;
	}

	:global(header nav a:hover),
	:global(header nav a:focus-visible) {
		color: #fbd000 !important;
		border-color: #fbd000 !important;
		text-decoration: none !important;
	}

	:global(h1),
	:global(h2),
	:global(h3),
	:global(.px) {
		font-family: 'Press Start 2P', 'Courier New', monospace;
		font-weight: 400;
		line-height: 1.5;
	}

	#bg {
		image-rendering: pixelated;
		image-rendering: crisp-edges;
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		display: block;
	}

	main {
		position: relative;
		z-index: 2;
	}

	:global(.coin-popup) {
		position: fixed;
		pointer-events: none;
		z-index: 50;
		font: 12px 'Press Start 2P', monospace;
		color: #fbd000;
		text-shadow: 2px 2px 0 #000;
	}

	@media (pointer: fine) {
		:global(body) {
			cursor:
				url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><rect x='4' y='4' width='16' height='16' fill='%23e52521' stroke='black' stroke-width='3'/></svg>")
					12 12,
				auto;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(*) {
			transition: none !important;
		}
	}

	:global(:focus-visible) {
		outline: 3px solid #fbd000;
		outline-offset: 2px;
	}
</style>
