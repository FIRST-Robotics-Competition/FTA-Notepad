<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { styles } from '$lib';

	interface ButtonProps {
		href?: string;
		type?: 'button' | 'reset' | 'submit';
		color?: keyof typeof colorClass;
		inline?: boolean;
		disabled?: boolean;
		class?: string;
		defaultClass?: string;
		onclick?: (event: MouseEvent) => void;
		children: any;
	}

	let {
		href,
		type = 'button',
		color = 'primary',
		inline = true,
		disabled = false,
		onclick,
		defaultClass = 'items-center justify-center gap-x-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-gray-100 p-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
		children,
		...restProps
	}: ButtonProps = $props();

	let colorClass = {
		none: '',
		primary:
			'bg-primary-500 hover:bg-primary-600 text-gray-800 dark:text-white focus-visible:bg-primary-500',
		blue: `${styles.alliance.blue.primary} ${styles.alliance.blue.primaryHover} ${styles.alliance.blue.primaryFocus}`,
		red: `${styles.alliance.red.primary} ${styles.alliance.red.primaryHover} ${styles.alliance.red.primaryFocus}`,
		green: 'bg-green-500 hover:bg-green-600 text-white focus-visible:bg-green-500',
		yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white focus-visible:bg-yellow-500',
		gray: 'bg-gray-500 hover:bg-gray-600 text-white focus-visible:bg-gray-500',
		dark: 'bg-gray-800 hover:bg-gray-900 text-white focus-visible:bg-gray-800',
		white: 'bg-white hover:bg-gray-100 text-black focus-visible:bg-white'
	};

	let disabledClass = 'cursor-not-allowed opacity-50 bg-gray-400 hover:bg-gray-400 text-gray-200';

	let buttonClass = $derived(
		twMerge(
			defaultClass,
			inline ? 'inline-flex' : '',
			disabled ? disabledClass : colorClass[color],
			restProps.class
		)
	);
</script>

{#if href}
	<a {href} {...restProps} class={buttonClass} role="button">
		{@render children()}
	</a>
{:else}
	<button {type} {onclick} class={buttonClass} {...restProps}>
		{@render children()}
	</button>
{/if}
