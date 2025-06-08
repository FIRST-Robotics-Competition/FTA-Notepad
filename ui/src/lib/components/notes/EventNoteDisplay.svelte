<script lang="ts">
	import type { EventNote } from '$lib/api-client/fms-client';
	import { formatTimestamp } from '$lib';

	interface EventNoteDisplayProps {
		note: EventNote;
	}

	let { note }: EventNoteDisplayProps = $props();
</script>

<div
	class="border-l-4 border-orange-200 dark:border-orange-800 bg-white dark:bg-gray-800 p-3 mb-2 rounded-r-md shadow-sm"
>
	<div class="flex items-start justify-between mb-2">
		<div class="flex flex-wrap gap-2">
			<span
				class="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
			>
				Event Note
			</span>
		</div>
		<span class="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
			{formatTimestamp(note.timeAdded)}
		</span>
	</div>

	<div class="text-sm text-gray-900 dark:text-gray-100 mb-2">
		{note.note || 'No note text'}
	</div>
</div>
