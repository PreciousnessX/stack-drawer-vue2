import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vue from '@vitejs/plugin-vue2';

const { resolve } = require('path');

export default defineConfig({
	base: '',
	plugins: [
		tsconfigPaths({
			projects: [resolve(__dirname, './tsconfig.json')],
		}),
		vue(),
	],
	root: resolve(__dirname, './example'),
	build: {
		outDir: 'dist',
		rollupOptions: {
			input: {
				main: resolve(__dirname, './example/index.html'),
			},
		},
	},
	server: {
		open: true,
	},
});
