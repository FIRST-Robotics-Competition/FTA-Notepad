<script lang="ts">
	import type { EventNote } from '$lib/api-client/fms-client';
	import { formatTimestamp, styles } from '$lib';

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
			<span class="{styles.badge.base} {styles.badge.orange}"> Event Note </span>
		</div>
		<span class="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
			{formatTimestamp(note.timeAdded)}
		</span>
	</div>

	<div class="text-sm text-gray-900 dark:text-gray-100 mb-2">
		{note.note || 'No note text'}
	</div>
</div>
