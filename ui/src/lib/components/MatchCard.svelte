<script lang="ts">
	import type { ScheduledMatch, MatchNote, TeamIssue } from '$lib/api-client/fms-client';
	import { countMatchNotes } from '$lib/api-client/fms-client';
	import NoteCount from './NoteCount.svelte';
	import TeamCard from './TeamCard.svelte';

	interface MatchCardProps {
		match: ScheduledMatch;
		matchNotes: MatchNote[];
		teamNotes: TeamIssue[];
		onAddMatchNote?: (matchNumber: number, tournamentLevel: string) => void;
		onAddTeamNote?: (teamNumber: number, matchNumber?: number, tournamentLevel?: string) => void;
	}

	let { match, matchNotes, teamNotes, onAddMatchNote, onAddTeamNote }: MatchCardProps = $props();

	let matchNoteCount = $derived(
		countMatchNotes(matchNotes, match.matchNumber || 0, match.level || '')
	);

	let startTime = $derived(
		match.startTime
			? new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			: ''
	);

	// Split teams by alliance
	let blueTeams = $derived(
		match.teams?.filter((team) => team.station?.toLowerCase().includes('blue')) || []
	);
	let redTeams = $derived(
		match.teams?.filter((team) => team.station?.toLowerCase().includes('red')) || []
	);

	function handleAddMatchNote() {
		if (onAddMatchNote && match.matchNumber && match.level) {
			onAddMatchNote(match.matchNumber, match.level);
		}
	}
</script>

<div class="border border-gray-200 rounded-lg p-4 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
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
			<NoteCount
				count={matchNoteCount}
				label="Match Notes"
				variant="match"
				onAddNote={handleAddMatchNote}
			/>
		</div>
	</div>

	{#if match.teams && match.teams.length > 0}
		<div class="grid grid-cols-2 gap-6">
			<!-- Blue Alliance -->
			<div>
				<h4 class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
					<div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
					Blue Alliance
				</h4>
				<div class="space-y-2">
					{#each blueTeams as team}
						<TeamCard
							teamNumber={team.teamNumber || 0}
							station={team.station || ''}
							surrogate={team.surrogate || false}
							{teamNotes}
							matchNumber={match.matchNumber}
							tournamentLevel={match.level || undefined}
							onAddNote={onAddTeamNote}
						/>
					{/each}
					{#if blueTeams.length === 0}
						<div
							class="text-center py-2 text-xs text-gray-400 border border-dashed border-gray-300 rounded dark:border-gray-600"
						>
							No teams assigned
						</div>
					{/if}
				</div>
			</div>

			<!-- Red Alliance -->
			<div>
				<h4 class="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center">
					<div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
					Red Alliance
				</h4>
				<div class="space-y-2">
					{#each redTeams as team}
						<TeamCard
							teamNumber={team.teamNumber || 0}
							station={team.station || ''}
							surrogate={team.surrogate || false}
							{teamNotes}
							matchNumber={match.matchNumber}
							tournamentLevel={match.level || undefined}
							onAddNote={onAddTeamNote}
						/>
					{/each}
					{#if redTeams.length === 0}
						<div
							class="text-center py-2 text-xs text-gray-400 border border-dashed border-gray-300 rounded dark:border-gray-600"
						>
							No teams assigned
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
