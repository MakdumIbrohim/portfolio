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
	{ name: 'Laravel', icon: 'L' },
	{ name: 'React.js', icon: 'R' },
	{ name: 'Flutter', icon: 'F' },
	{ name: 'JavaScript', icon: 'JS' },
	{ name: 'PHP', icon: 'P' },
	{ name: 'MySQL', icon: 'DB' },
	{ name: 'Git', icon: 'G' },
	{ name: 'Three.js', icon: '3D' }
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
