<script lang="ts">
	import type { TeamIssue } from '$lib/api-client/fms-client';
	import { countTeamMatchSpecificNotes, countTeamGeneralNotes } from '$lib/api-client/fms-client';
	import NoteCount from './NoteCount.svelte';

	interface TeamCardProps {
		teamNumber: number;
		station: string;
		surrogate?: boolean;
		teamNotes: TeamIssue[];
		matchNumber?: number;
		tournamentLevel?: string;
	}

	let {
		teamNumber,
		station,
		surrogate = false,
		teamNotes,
		matchNumber,
		tournamentLevel
	}: TeamCardProps = $props();

	let matchSpecificNotes = $derived(
		matchNumber && tournamentLevel
			? countTeamMatchSpecificNotes(teamNotes, teamNumber, matchNumber, tournamentLevel)
			: 0
	);

	let generalNotes = $derived(countTeamGeneralNotes(teamNotes, teamNumber));
</script>

<div
	class="flex flex-col p-3 border rounded-lg {surrogate
		? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20'
		: 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'}"
>
	<div class="flex items-center justify-between mb-2">
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium text-gray-500 dark:text-gray-400">{station}</span>
			<span class="text-lg font-bold text-gray-900 dark:text-white">#{teamNumber}</span>
			{#if surrogate}
				<span
					class="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300"
				>
					Surrogate
				</span>
			{/if}
		</div>
	</div>

	<div class="flex flex-wrap gap-2 text-xs">
		{#if matchNumber && tournamentLevel}
			<NoteCount count={matchSpecificNotes} label="Match Notes" variant="match" />
		{/if}
		<NoteCount count={generalNotes} label="Team Notes" variant="team" />
	</div>
</div>
