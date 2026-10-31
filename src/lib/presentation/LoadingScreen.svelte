<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let loadEl = $state<HTMLDivElement>();
	let barFill = $state<HTMLElement>();
	let visible = $state(true);

	onMount(() => {
		if (!loadEl || !barFill) return;
		const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
		gsap.to(barFill, {
			width: '100%',
			duration: reduce ? 0.01 : 1.1,
			ease: 'steps(8)',
			onComplete: () => {
				if (!loadEl) return;
				gsap.to(loadEl, {
					opacity: 0,
					duration: reduce ? 0.01 : 0.4,
					onComplete: () => {
						visible = false;
					}
				});
			}
		});
	});
</script>

{#if visible}
	<div id="load" bind:this={loadEl} role="status">
		<div>
			Loading World...
			<div class="bar">
				<i bind:this={barFill}></i>
			</div>
		</div>
	</div>
{/if}

<style>
	#load {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: #000;
		display: grid;
		place-items: center;
		text-align: center;
		font: 14px 'Press Start 2P', monospace;
		color: #ffffff;
	}

	.bar {
		width: min(260px, 70vw);
		height: 16px;
		border: 4px solid #fff;
		margin: 18px auto 0;
		padding: 2px;
	}

	.bar i {
		display: block;
		height: 100%;
		width: 0;
		background: #fbd000;
	}
</style>
