export interface TechItem {
	name: string;
	icon: string;
}

export interface StageProject {
	stage: string;
	title: string;
	desc: string;
	tags: string[];
	githubUrl: string;
	demoUrl: string;
}

export interface JourneyMilestone {
	level: string;
	desc: string;
}

export interface RetroProfile {
	name: string;
	title: string;
	world: string;
	bio: string;
	about: string[];
	email: string;
	github: string;
	linkedin: string;
	instagram: string;
}

export const PROFILE: RetroProfile = {
	name: 'MAKDUM IBROHIM',
	title: 'Junior Developer · Problem Solver',
	world: 'WORLD 1-1',
	bio: 'Junior software developer yang fokus membangun solusi web dan aplikasi yang efisien, tangguh, dan mudah digunakan.',
	about: [
		'Halo! Saya Makdum Ibrohim, seorang developer yang bersemangat dalam eksplorasi teknologi dan pemecahan masalah komputasi.',
		'Mulai tertarik pada software development sejak pertama kali memahami logika algoritma dan kepuasan merakit program dari baris-baris kode.',
		'Saat ini aktif memperdalam arsitektur web modern, full-stack framework, serta dasar-dasar sistem terdistribusi.'
	],
	email: 'makdumibrohim@gmail.com',
	github: 'https://github.com/makdumibrohim',
	linkedin: 'https://linkedin.com/in/makdumibrohim',
	instagram: 'https://instagram.com/makdumibrohim'
};

export const TECH_ITEMS: TechItem[] = [
	{
		name: 'Laravel',
		icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M23.653 7.839L19.4 5.376a.465.465 0 0 0-.472.004l-4.148 2.45a.468.468 0 0 0-.23.404v4.91a.466.466 0 0 0 .232.404l4.148 2.449a.466.466 0 0 0 .472-.004l4.253-2.463a.468.468 0 0 0 .233-.404V8.243a.469.469 0 0 0-.235-.404zm-4.375 7.155l-3.46-2.043V8.868l3.46 2.043v4.083zm.707-.417v-4.084l3.46-2.003v4.084l-3.46 2.003zm-.237-4.895L16.29 7.64l3.458-2.042 3.458 2.003-3.46 2.081zM9.47 16.037l-4.148-2.45A.466.466 0 0 1 5.09 13.18V8.271a.467.467 0 0 1 .232-.404l4.148-2.45a.467.467 0 0 1 .472.004l4.253 2.463a.468.468 0 0 1 .233.404v4.909a.467.467 0 0 1-.233.404l-4.253 2.463a.465.465 0 0 1-.472-.023zm-.235-7.155L5.777 6.839v4.083l3.458 2.043V8.882zm.707.417v4.084l3.46-2.003V6.879l-3.46 2.42zm-.237 4.895l3.46-2.003-3.46-2.043-3.458 2.043 3.458 2.003z"/></svg>`
	},
	{
		name: 'React.js',
		icon: `<svg viewBox="-11.5 -10.23 23 20.46" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="0" cy="0" r="2.1" fill="currentColor"/><g stroke="currentColor"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`
	},
	{
		name: 'Flutter',
		icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zM14.314 11.23L8.685 16.86l2.94 2.94 8.7-8.57h-6.011zm0 7.37l-2.485 2.486L14.77 24h6.015l-6.471-5.4z"/></svg>`
	},
	{
		name: 'JavaScript',
		icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.017-.888-1.798-2.68-2.528l-.615-.246c-.73-.292-1.04-.59-1.04-1.037 0-.472.378-.813 1.053-.813.638 0 1.017.26 1.343.813l1.83-1.157c-.557-.992-1.464-1.554-2.906-1.554-1.932 0-3.23 1.157-3.23 2.94 0 1.258.742 2.067 2.148 2.656l.617.25c.875.362 1.2.668 1.2 1.22 0 .52-.455.91-1.22.91-.976 0-1.444-.47-1.89-1.24l-1.897 1.09c.638 1.314 1.764 2.015 3.473 2.015 2.197 0 3.39-1.158 3.39-3.284v-.004zm-8.243-7.797h-2.313v7.452c0 1.233-.05 1.737-.367 2.083-.342.378-.875.46-1.503.46-.496 0-.967-.066-1.3-.198l-.297 1.832c.504.183 1.173.28 1.94.28 1.487 0 2.503-.438 3.016-1.28.53-.873.524-2.02.524-3.567V10.48z"/></svg>`
	},
	{
		name: 'PHP',
		icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12.016 3C6.49 3 2.016 7.48 2.016 13s4.474 10 10 10 10-4.48 10-10-4.474-10-10-10zm-6.19 12.87l1.45-5.74h2.15c.98 0 1.7.2 2.14.61.45.41.56 1.03.35 1.86-.3 1.19-.94 1.95-1.92 2.31-.6.22-1.38.33-2.35.33h-.97l-.85 3.37H5.826zm6.34 0l1.45-5.74h1.72l-.37 1.49h.09c.43-.59.93-1.02 1.5-1.29.57-.27 1.25-.41 2.05-.41.98 0 1.7.2 2.14.61.45.41.56 1.03.35 1.86-.3 1.19-.94 1.95-1.92 2.31-.6.22-1.38.33-2.35.33h-.97l-.85 3.37h-1.84zm-3.21-4.22c.2-.79.14-1.3-.18-1.52-.32-.23-.9-.34-1.74-.34h-.91l-.81 3.22h.96c.86 0 1.46-.11 1.81-.34.34-.23.63-.6.87-1.02zm8.56 0c.2-.79.14-1.3-.18-1.52-.32-.23-.9-.34-1.74-.34h-.91l-.81 3.22h.96c.86 0 1.46-.11 1.81-.34.34-.23.63-.6.87-1.02z"/></svg>`
	},
	{
		name: 'MySQL',
		icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2zm0 2.5c4.14 0 7.5 1.12 7.5 2s-3.36 2-7.5 2-7.5-1.12-7.5-2 3.36-2 7.5-2zM4.5 10.3c1.78 1.05 4.49 1.7 7.5 1.7s5.72-.65 7.5-1.7v2.2c0 .88-3.36 2-7.5 2s-7.5-1.12-7.5-2v-2.2zm0 5.5c1.78 1.05 4.49 1.7 7.5 1.7s5.72-.65 7.5-1.7v2.2c0 .88-3.36 2-7.5 2s-7.5-1.12-7.5-2v-2.2z"/></svg>`
	},
	{
		name: 'Git',
		icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M21.616 10.92l-8.53-8.54a2.27 2.27 0 0 0-3.21 0l-1.9 1.9 2.42 2.42a2.69 2.69 0 0 1 3.42 3.45l2.33 2.33a2.68 2.68 0 1 1-1.6 1.6l-2.18-2.18v4.94a2.69 2.69 0 1 1-2.27-.05V11.8a2.7 2.7 0 0 1-1.44-3.53L6.25 5.86 2.38 9.74a2.27 2.27 0 0 0 0 3.21l8.54 8.54a2.27 2.27 0 0 0 3.21 0l7.49-7.36a2.27 2.27 0 0 0-.004-3.21z"/></svg>`
	},
	{
		name: 'Three.js',
		icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2L1.5 20.5h21L12 2zm0 4.1L18.7 18H5.3L12 6.1zM10.8 10l-3.5 6h9.4L13.2 10h-2.4z"/></svg>`
	}
];

export const STAGE_PROJECTS: StageProject[] = [
	{
		stage: 'STAGE 1',
		title: 'Sistem Manajemen Inventaris',
		desc: 'Aplikasi pengelolaan stok dan transaksi barang terpadu dengan autentikasi multi-level.',
		tags: ['Laravel', 'MySQL'],
		githubUrl: '#',
		demoUrl: '#'
	},
	{
		stage: 'STAGE 2',
		title: 'Dashboard Analitik Interaktif',
		desc: 'Antarmuka pemantauan data real-time dengan visualisasi dinamis dan filter multi-metrik.',
		tags: ['React.js', 'JavaScript'],
		githubUrl: '#',
		demoUrl: '#'
	},
	{
		stage: 'STAGE 3',
		title: 'Aplikasi Mobile Presensi',
		desc: 'Aplikasi absensi berbasis geolokasi dan biometrik dengan sinkronisasi data instan.',
		tags: ['Flutter', 'Git'],
		githubUrl: '#',
		demoUrl: '#'
	}
];

export const JOURNEY_LEVELS: JourneyMilestone[] = [
	{
		level: 'Level 1 · Awal Petualangan',
		desc: 'Mulai mempelajari dasar-dasar algoritma, logika pemrograman, dan fondasi web (HTML, CSS, JS).'
	},
	{
		level: 'Level 2 · Pelatihan & Eksplorasi',
		desc: 'Mengikuti pelatihan intensif, membangun berbagai mini-project, dan memahami database relasional.'
	},
	{
		level: 'Level 3 · Proyek & Implementasi',
		desc: 'Merancang arsitektur aplikasi riil, berkontribusi dalam tim, dan menerapkan best practice software engineering.'
	}
];
