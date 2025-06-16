<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import TeamMatchNote from '$lib/components/notes/TeamMatchNote.svelte';

	const params = page.params;

	export let data: PageData;
</script>

<div>
	<h1 class="text-2xl font-semibold leading-7">Team {params.teamNumber}</h1>
</div>

{#if data.notes}
	{#if data.notes.length > 0}
		<ul role="list" class="divide-y divide-gray-100">
			{#each data.notes as note}
				<TeamMatchNote {note} />
			{/each}
		</ul>
	{:else}
		<p>No notes yet</p>
	{/if}
{:else}
	<p>Error loading notes: {data.notesError.status}</p>
{/if}
