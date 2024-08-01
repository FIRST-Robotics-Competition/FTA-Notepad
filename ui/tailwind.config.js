/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#eeeeff',
					100: '#e0e1ff',
					200: '#c7c8fe',
					300: '#a5a7fc',
					400: '#8184f8',
					500: '#6366f1',
					600: '#4649e5',
					700: '#383bca',
					800: '#3032a3',
					900: '#2e3081',
					950: '#1b1c4b'
				}
			}
		}
	},
	plugins: [],
	darkMode: 'class'
};
