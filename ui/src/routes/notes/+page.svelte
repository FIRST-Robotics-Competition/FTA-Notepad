<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import {
		getEventSchedule,
		getNoteCounts,
		getCurrentEvent,
		createEventNote,
		createMatchNote,
		createTeamNote
	} from '$lib/api-client/fms-client';
	import type {
		ScheduledMatch,
		EventNote,
		MatchNote,
		TeamIssue,
		CreateEventNoteRequest,
		CreateMatchNoteRequest,
		CreateTeamNoteRequest
	} from '$lib/api-client/fms-client';
	import { TournamentLevel } from '../../fms/fms-api';
	import MatchCard from '$lib/components/MatchCard.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import AddNoteModal from '$lib/components/dialogs/AddNoteModal.svelte';
	import EventNoteDisplay from '$lib/components/notes/EventNoteDisplay.svelte';
	import { styles } from '$lib';

	let { data }: { data: PageData } = $props();

	let loading = $state(true);
	let error = $state<string | null>(null);
	let practiceSchedule: ScheduledMatch[] = $state([]);
	let qualificationSchedule: ScheduledMatch[] = $state([]);
	let playoffSchedule: ScheduledMatch[] = $state([]);
	let eventNotes: EventNote[] = $state([]);
	let matchNotes: MatchNote[] = $state([]);
	let teamNotes: TeamIssue[] = $state([]);

	// Modal state
	let isModalOpen = $state(false);
	let modalNoteType = $state<'event' | 'match' | 'team'>('event');
	let modalMatchNumber = $state<number | undefined>(undefined);
	let modalTournamentLevel = $state<string | undefined>(undefined);
	let modalTeamNumber = $state<number | undefined>(undefined);

	const currentEvent = getCurrentEvent();

	async function loadData() {
		try {
			loading = true;
			error = null;

			const [practiceResult, qualificationResult, playoffResult, notesResult] = await Promise.all([
				getEventSchedule(fetch, TournamentLevel.Practice),
				getEventSchedule(fetch, TournamentLevel.Qualification),
				getEventSchedule(fetch, TournamentLevel.Playoff),
				getNoteCounts(fetch)
			]);

			// Check for errors in schedule results
			if (practiceResult.error) {
				console.warn('Failed to load practice schedule:', practiceResult.error);
			}
			if (qualificationResult.error) {
				console.warn('Failed to load qualification schedule:', qualificationResult.error);
			}
			if (playoffResult.error) {
				console.warn('Failed to load playoff schedule:', playoffResult.error);
			}

			if (notesResult.errors.length > 0) {
				console.warn('Some notes failed to load:', notesResult.errors);
			}

			practiceSchedule = practiceResult.schedule || [];
			qualificationSchedule = qualificationResult.schedule || [];
			playoffSchedule = playoffResult.schedule || [];
			eventNotes = notesResult.eventNotes;
			matchNotes = notesResult.matchNotes;
			teamNotes = notesResult.teamNotes;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load data';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadData();
	});

	// Note creation handlers
	function handleAddEventNote() {
		modalNoteType = 'event';
		modalMatchNumber = undefined;
		modalTournamentLevel = undefined;
		modalTeamNumber = undefined;
		isModalOpen = true;
	}

	function handleAddMatchNote(matchNumber: number, tournamentLevel: string) {
		modalNoteType = 'match';
		modalMatchNumber = matchNumber;
		modalTournamentLevel = tournamentLevel;
		modalTeamNumber = undefined;
		isModalOpen = true;
	}

	function handleAddTeamNote(teamNumber: number, matchNumber?: number, tournamentLevel?: string) {
		modalNoteType = 'team';
		modalMatchNumber = matchNumber;
		modalTournamentLevel = tournamentLevel;
		modalTeamNumber = teamNumber;
		isModalOpen = true;
	}

	function handleCloseModal() {
		isModalOpen = false;
	}

	async function handleSubmitNote(
		noteData: CreateEventNoteRequest | CreateMatchNoteRequest | CreateTeamNoteRequest
	) {
		let result;

		switch (modalNoteType) {
			case 'event':
				result = await createEventNote(fetch, noteData as CreateEventNoteRequest);
				break;
			case 'match':
				result = await createMatchNote(fetch, noteData as CreateMatchNoteRequest);
				break;
			case 'team':
				result = await createTeamNote(fetch, noteData as CreateTeamNoteRequest);
				break;
		}

		if (result.error) {
			console.error('Failed to create note:', result.error);
			throw new Error(`Failed to create note: ${result.error}`);
		} else {
			console.log('Note created successfully');
			// Reload data to show the new note
			await loadData();
		}
	}

	// Collapsible section states
	let eventNotesExpanded = $state(false);
	let practiceExpanded = $state(true);
	let qualificationExpanded = $state(true);
	let playoffExpanded = $state(true);
</script>

<svelte:head>
	<title>Notes Overview - FTA Notepad</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="border-b border-gray-200 pb-5 dark:border-gray-700">
		<div class="flex items-center justify-between">
			<div>
				<h1
					class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl"
				>
					Notes Overview
				</h1>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
					Event: <span class="font-medium">{currentEvent.eventCode}</span> • Season:
					<span class="font-medium">{currentEvent.season}</span>
				</p>
			</div>
			<button
				type="button"
				class="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
				onclick={loadData}
				disabled={loading}
			>
				{#if loading}
					<Spinner size="sm" class="mr-2" />
				{/if}
				Refresh
			</button>
		</div>
	</div>

	{#if loading}
		<div class="flex justify-center py-12">
			<Spinner size="lg" />
		</div>
	{:else if error}
		<div class={styles.error.container}>
			<div class="flex">
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error loading data</h3>
					<div class="mt-2 text-sm text-red-700 dark:text-red-300">
						<p>{error}</p>
					</div>
					<div class="mt-4">
						<button type="button" class={styles.error.button} onclick={loadData}>
							Try again
						</button>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Event Notes Section -->
		<div>
			<button
				type="button"
				class={styles.sectionHeader.button}
				onclick={() => (eventNotesExpanded = !eventNotesExpanded)}
				aria-label={eventNotesExpanded ? 'Collapse event notes' : 'Expand event notes'}
			>
				<h2 class="text-lg font-medium text-gray-900 dark:text-white">
					Event Notes
					<span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
						({eventNotes.filter((note) => !note.isDeleted).length}
						{eventNotes.filter((note) => !note.isDeleted).length === 1 ? 'note' : 'notes'})
					</span>
				</h2>
				<div class="flex items-center gap-2">
					<div
						role="button"
						tabindex="0"
						class="inline-flex items-center justify-center rounded-md bg-orange-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 cursor-pointer"
						onclick={(e) => {
							e.stopPropagation();
							handleAddEventNote();
						}}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								e.stopPropagation();
								handleAddEventNote();
							}
						}}
						aria-label="Add event note"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
					</div>
					<svg
						class="w-5 h-5 text-gray-500 transition-transform duration-200 {eventNotesExpanded
							? 'rotate-90'
							: ''}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</button>
			{#if eventNotesExpanded}
				{#if eventNotes.filter((note) => !note.isDeleted).length === 0}
					<div class={styles.emptyState.container}>
						<p class="text-sm text-gray-500 dark:text-gray-400">No event notes yet</p>
					</div>
				{:else}
					<div class="space-y-2 max-h-96 overflow-y-auto">
						{#each eventNotes
							.filter((note) => !note.isDeleted)
							.sort((a, b) => {
								const timeA = a.timeAdded ? new Date(a.timeAdded).getTime() : 0;
								const timeB = b.timeAdded ? new Date(b.timeAdded).getTime() : 0;
								return timeB - timeA;
							}) as note (note.noteId)}
							<EventNoteDisplay {note} />
						{/each}
					</div>
				{/if}
			{/if}
		</div>

		<!-- Schedule -->
		<div class="space-y-8">
			<!-- Practice Schedule -->
			<div>
				<button
					type="button"
					class="flex items-center justify-between w-full text-left mb-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
					onclick={() => (practiceExpanded = !practiceExpanded)}
				>
					<h2 class="text-lg font-medium text-gray-900 dark:text-white">
						Practice Schedule
						<span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
							({practiceSchedule.length}
							{practiceSchedule.length === 1 ? 'match' : 'matches'})
						</span>
					</h2>
					<svg
						class="w-5 h-5 text-gray-500 transition-transform duration-200 {practiceExpanded
							? 'rotate-90'
							: ''}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</button>
				{#if practiceExpanded}
					{#if practiceSchedule.length === 0}
						<div class={styles.emptyState.container}>
							<p class="text-sm text-gray-500 dark:text-gray-400">No practice matches scheduled</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each practiceSchedule as match (match.matchNumber)}
								<MatchCard
									{match}
									{matchNotes}
									{teamNotes}
									onAddMatchNote={handleAddMatchNote}
									onAddTeamNote={handleAddTeamNote}
								/>
							{/each}
						</div>
					{/if}
				{/if}
			</div>

			<!-- Qualification Schedule -->
			<div>
				<button
					type="button"
					class="flex items-center justify-between w-full text-left mb-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
					onclick={() => (qualificationExpanded = !qualificationExpanded)}
				>
					<h2 class="text-lg font-medium text-gray-900 dark:text-white">
						Qualification Schedule
						<span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
							({qualificationSchedule.length}
							{qualificationSchedule.length === 1 ? 'match' : 'matches'})
						</span>
					</h2>
					<svg
						class="w-5 h-5 text-gray-500 transition-transform duration-200 {qualificationExpanded
							? 'rotate-90'
							: ''}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</button>
				{#if qualificationExpanded}
					{#if qualificationSchedule.length === 0}
						<div class={styles.emptyState.container}>
							<p class="text-sm text-gray-500 dark:text-gray-400">
								No qualification matches scheduled
							</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each qualificationSchedule as match (match.matchNumber)}
								<MatchCard
									{match}
									{matchNotes}
									{teamNotes}
									onAddMatchNote={handleAddMatchNote}
									onAddTeamNote={handleAddTeamNote}
								/>
							{/each}
						</div>
					{/if}
				{/if}
			</div>

			<!-- Playoff Schedule -->
			<div>
				<button
					type="button"
					class="flex items-center justify-between w-full text-left mb-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
					onclick={() => (playoffExpanded = !playoffExpanded)}
				>
					<h2 class="text-lg font-medium text-gray-900 dark:text-white">
						Playoff Schedule
						<span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
							({playoffSchedule.length}
							{playoffSchedule.length === 1 ? 'match' : 'matches'})
						</span>
					</h2>
					<svg
						class="w-5 h-5 text-gray-500 transition-transform duration-200 {playoffExpanded
							? 'rotate-90'
							: ''}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</button>
				{#if playoffExpanded}
					{#if playoffSchedule.length === 0}
						<div class={styles.emptyState.container}>
							<p class="text-sm text-gray-500 dark:text-gray-400">No playoff matches scheduled</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each playoffSchedule as match (match.matchNumber)}
								<MatchCard
									{match}
									{matchNotes}
									{teamNotes}
									onAddMatchNote={handleAddMatchNote}
									onAddTeamNote={handleAddTeamNote}
								/>
							{/each}
						</div>
					{/if}
				{/if}
			</div>

			<!-- Show message if no schedules at all -->
			{#if practiceSchedule.length === 0 && qualificationSchedule.length === 0 && playoffSchedule.length === 0}
				<div class="text-center py-12">
					<svg
						class="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
						/>
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
						No matches scheduled
					</h3>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Check the FMS connection or try refreshing the data.
					</p>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Add Note Modal -->
	<AddNoteModal
		bind:isOpen={isModalOpen}
		noteType={modalNoteType}
		matchNumber={modalMatchNumber}
		tournamentLevel={modalTournamentLevel}
		teamNumber={modalTeamNumber}
		onClose={handleCloseModal}
		onSubmit={handleSubmitNote}
	/>
</div>
