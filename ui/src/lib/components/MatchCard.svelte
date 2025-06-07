<script lang="ts">
	import type { ScheduledMatch, MatchNote, TeamIssue } from '$lib/api-client/fms-client';
	import { countMatchNotes } from '$lib/api-client/fms-client';
	import NoteCount from './NoteCount.svelte';
	import TeamCard from './TeamCard.svelte';

	interface MatchCardProps {
		match: ScheduledMatch;
		matchNotes: MatchNote[];
		teamNotes: TeamIssue[];
	}

	let { match, matchNotes, teamNotes }: MatchCardProps = $props();

	let matchNoteCount = $derived(
		countMatchNotes(matchNotes, match.matchNumber || 0, match.level || '')
	);

	let startTime = $derived(
		match.startTime
			? new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			: ''
	);
</script>

<div class="border border-gray-200 rounded-lg p-4 bg-white dark:border-gray-700 dark:bg-gray-800">
	<div class="flex items-center justify-between mb-3">
		<div class="flex items-center gap-3">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				{match.description || `Match ${match.matchNumber}`}
			</h3>
			{#if match.field}
				<span
					class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
				>
					{match.field}
				</span>
			{/if}
		</div>
		<div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
			{#if startTime}
				<span>{startTime}</span>
			{/if}
			<NoteCount count={matchNoteCount} label="Match Notes" variant="match" />
		</div>
	</div>

	{#if match.teams && match.teams.length > 0}
		<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
			{#each match.teams as team}
				<TeamCard
					teamNumber={team.teamNumber || 0}
					station={team.station || ''}
					surrogate={team.surrogate || false}
					{teamNotes}
					matchNumber={match.matchNumber}
					tournamentLevel={match.level || undefined}
				/>
			{/each}
		</div>
	{/if}
</div>
