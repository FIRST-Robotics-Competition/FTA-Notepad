<script lang="ts">
	import type { TeamIssue } from '$lib/api-client/fms-client';
	import { formatIssueType, formatResolutionStatus, getStatusColor, formatTimestamp } from '$lib';
	interface TeamNoteDisplayProps {
		note: TeamIssue;
	}

	let { note }: TeamNoteDisplayProps = $props();

	// Check if this is a match-specific note
	let isMatchSpecific = $derived(note.matchNumber !== null && note.matchNumber !== undefined);
</script>

<div
	class="border-l-4 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 p-3 mb-2 rounded-r-md shadow-sm"
>
	<div class="flex items-start justify-between mb-2">
		<div class="flex flex-wrap gap-2">
			<span
				class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
			>
				{formatIssueType(note.issueType)}
			</span>
			<span
				class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getStatusColor(
					note.resolutionStatus
				)}"
			>
				{formatResolutionStatus(note.resolutionStatus)}
			</span>
			{#if isMatchSpecific}
				<span
					class="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
				>
					Match {note.matchNumber}{note.playNumber ? `.${note.playNumber}` : ''}
				</span>
			{/if}
		</div>
		<span class="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
			{formatTimestamp(note.timeAdded)}
		</span>
	</div>

	<div class="text-sm text-gray-900 dark:text-gray-100 mb-2">
		{note.note || 'No note text'}
	</div>
</div>
