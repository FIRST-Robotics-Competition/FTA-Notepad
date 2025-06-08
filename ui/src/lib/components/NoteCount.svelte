<script lang="ts">
	import { styles } from '$lib';

	interface NoteCountProps {
		count: number;
		label: string;
		variant?: 'default' | 'match' | 'team';
		onAddNote?: () => void;
	}

	let { count = 0, label, variant = 'default', onAddNote }: NoteCountProps = $props();

	const getVariantClasses = (variant: string) => {
		switch (variant) {
			case 'match':
				return `${styles.alliance.blue.secondary} ${styles.alliance.blue.secondaryText}`;
			case 'team':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
		}
	};
</script>

<div class="inline-flex items-center gap-2">
	<div class="inline-flex items-center gap-1">
		<span class="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
		<span
			class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getVariantClasses(
				variant
			)}"
		>
			{count}
		</span>
	</div>
	{#if onAddNote}
		<button
			onclick={onAddNote}
			class="inline-flex items-center justify-center w-6 h-6 rounded-full {styles.alliance.blue
				.primary} {styles.alliance.blue
				.primaryHover} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
			title="Add Note"
			aria-label="Add Note"
		>
			<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
		</button>
	{/if}
</div>
