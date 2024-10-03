<script lang="ts">
	import type { TeamIssue } from '$lib/api-client/fms-client';

	export let note: TeamIssue;

	const updateDate = new Date(note.timeUpdated ?? '');
	const updateDateString = updateDate.toLocaleDateString();
	const updateTimeString = updateDate.toLocaleTimeString();
	const author = note.whoUpdated ?? note.whoAdded;
</script>

<li class="py-5">
	<div>
		<div class="flex">
			<p class="text-md font-semibold leading-relaxed">
				Match: {note.tournamentLevel}
				{note.matchNumber}
			</p>
			{#if note.playNumber != undefined && note.playNumber > 1}
				<p class="ml-1.5">(play {note.playNumber})</p>
			{/if}
		</div>
		<p class="text-base">{note.note}</p>
		<p class="text-xs italic text-gray-400 justify-self-end">
			Last updated: {updateDateString} at {updateTimeString} by {author}
		</p>
	</div>
</li>
