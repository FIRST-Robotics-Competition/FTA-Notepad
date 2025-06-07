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

	let totalNotes = $derived(matchSpecificNotes + generalNotes);

	// Determine station color based on alliance
	let stationColor = $derived((() => {
		const stationLower = station.toLowerCase();
		if (stationLower.includes('red')) {
			return {
				bg: 'bg-red-500',
				text: 'text-white',
				border: 'border-red-500',
				lightBg: 'bg-red-50',
				darkBorder: 'dark:border-red-400',
				darkLightBg: 'dark:bg-red-900/20'
			};
		} else if (stationLower.includes('blue')) {
			return {
				bg: 'bg-blue-500',
				text: 'text-white',
				border: 'border-blue-500',
				lightBg: 'bg-blue-50',
				darkBorder: 'dark:border-blue-400',
				darkLightBg: 'dark:bg-blue-900/20'
			};
		} else {
			// Fallback for unknown stations
			return {
				bg: 'bg-gray-500',
				text: 'text-white',
				border: 'border-gray-500',
				lightBg: 'bg-gray-50',
				darkBorder: 'dark:border-gray-400',
				darkLightBg: 'dark:bg-gray-900/20'
			};
		}
	})());
</script>

<div
	class="flex flex-col p-3 border-2 rounded-lg {surrogate
		? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20'
		: `${stationColor.border} ${stationColor.lightBg} ${stationColor.darkBorder} ${stationColor.darkLightBg}`}"
>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<span class="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold {stationColor.bg} {stationColor.text}">
				{station[station.length - 1]}
			</span>
			<span class="text-lg font-bold text-gray-900 dark:text-white">#{teamNumber}</span>
			{#if surrogate}
				<span
					class="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300"
				>
					Surrogate
				</span>
			{/if}
		</div>
		<NoteCount count={totalNotes} label="Notes" variant="team" />
	</div>
</div>
