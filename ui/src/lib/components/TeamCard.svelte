<script lang="ts">
	import type { TeamIssue } from '$lib/api-client/fms-client';
	import NoteCount from './NoteCount.svelte';
	import TeamNoteDisplay from './notes/TeamNoteDisplay.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ChevronDown, ChevronRight } from '@steeze-ui/heroicons';
	import { styles } from '$lib';

	interface TeamCardProps {
		teamNumber: number;
		station: string;
		surrogate?: boolean;
		teamNotes: TeamIssue[];
		matchNumber?: number;
		tournamentLevel?: string;
		onAddNote?: (teamNumber: number, matchNumber?: number, tournamentLevel?: string) => void;
	}

	let {
		teamNumber,
		station,
		surrogate = false,
		teamNotes,
		matchNumber,
		tournamentLevel,
		onAddNote
	}: TeamCardProps = $props();

	// State for collapsible functionality
	let isExpanded = $state(false);

	// Count all team notes for display
	let totalNotes = $derived(
		teamNotes.filter((note) => note.teamNumber === teamNumber && !note.isDeleted).length
	);

	// Get all notes for this team (from all matches for context)
	let teamNotesForDisplay = $derived(
		teamNotes
			.filter((note) => note.teamNumber === teamNumber && !note.isDeleted)
			.sort((a, b) => {
				// Sort by time added, most recent first
				const timeA = a.timeAdded ? new Date(a.timeAdded).getTime() : 0;
				const timeB = b.timeAdded ? new Date(b.timeAdded).getTime() : 0;
				return timeB - timeA;
			})
	);

	function handleAddNote() {
		if (onAddNote) {
			onAddNote(teamNumber, matchNumber, tournamentLevel);
		}
	}

	function toggleExpanded() {
		if (totalNotes > 0) {
			isExpanded = !isExpanded;
		}
	}

	// Determine station color based on alliance
	let stationColor = $derived(
		(() => {
			const stationLower = station.toLowerCase();
			if (stationLower.includes('red')) {
				return {
					bg: styles.alliance.red.primary,
					border: styles.alliance.red.border,
					lightBg: styles.alliance.red.secondary,
					darkBorder: styles.alliance.red.darkBorder
				};
			} else if (stationLower.includes('blue')) {
				return {
					bg: styles.alliance.blue.primary,
					border: styles.alliance.blue.border,
					lightBg: styles.alliance.blue.secondary,
					darkBorder: styles.alliance.blue.darkBorder
				};
			} else {
				// Fallback for unknown stations
				return {
					bg: 'bg-gray-500 text-white',
					border: 'border-gray-500',
					lightBg: 'bg-gray-50',
					darkBorder: 'dark:border-gray-400'
				};
			}
		})()
	);
</script>

<div
	class="flex flex-col border-2 rounded-lg {surrogate
		? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20'
		: `${stationColor.border} ${stationColor.lightBg} ${stationColor.darkBorder}`}"
>
	<!-- Team Header (always visible) -->
	<div class="flex items-center justify-between p-3">
		<div class="flex items-center gap-2">
			<span
				class="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold {stationColor.bg}"
			>
				{station[station.length - 1]}
			</span>
			<span class="text-lg font-bold text-gray-900 dark:text-white">#{teamNumber}</span>
			{#if surrogate}
				<span
					class="hidden sm:inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300"
				>
					Surrogate
				</span>
			{/if}
		</div>
		<div class="flex items-center gap-2">
			<NoteCount count={totalNotes} label="Notes" variant="team" onAddNote={handleAddNote} />
			{#if totalNotes > 0}
				<button
					onclick={toggleExpanded}
					class="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
					aria-label={isExpanded ? 'Collapse notes' : 'Expand notes'}
				>
					<Icon
						src={isExpanded ? ChevronDown : ChevronRight}
						theme="outline"
						class="w-5 h-5 text-gray-600 dark:text-gray-400"
					/>
				</button>
			{/if}
		</div>
	</div>

	<!-- Collapsible Notes Section -->
	{#if isExpanded && totalNotes > 0}
		<div class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
			<div class="max-h-96 overflow-y-auto space-y-1">
				<!-- All team notes from all matches for full context -->
				<div>
					<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
						All Team Notes ({teamNotesForDisplay.length})
					</h4>
					{#each teamNotesForDisplay as note (note.noteId)}
						<TeamNoteDisplay {note} />
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
