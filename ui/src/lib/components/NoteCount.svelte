<script lang="ts">
	interface NoteCountProps {
		count: number;
		label: string;
		variant?: 'default' | 'match' | 'team';
	}

	let { count = 0, label, variant = 'default' }: NoteCountProps = $props();

	const getVariantClasses = (variant: string) => {
		switch (variant) {
			case 'match':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
			case 'team':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
		}
	};
</script>

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
