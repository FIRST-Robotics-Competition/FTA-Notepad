<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { getEventSchedule, getNoteCounts, getCurrentEvent } from '$lib/api-client/fms-client';
	import type { ScheduledMatch, EventNote, MatchNote, TeamIssue } from '$lib/api-client/fms-client';
	import { TournamentLevel } from '../../fms/fms-api';
	import MatchCard from '$lib/components/MatchCard.svelte';
	import NoteCount from '$lib/components/NoteCount.svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	let { data }: { data: PageData } = $props();

	let loading = $state(true);
	let error = $state<string | null>(null);
	let practiceSchedule: ScheduledMatch[] = $state([]);
	let qualificationSchedule: ScheduledMatch[] = $state([]);
	let playoffSchedule: ScheduledMatch[] = $state([]);
	let eventNotes: EventNote[] = $state([]);
	let matchNotes: MatchNote[] = $state([]);
	let teamNotes: TeamIssue[] = $state([]);

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

	let totalEventNotes = $derived(eventNotes.filter((note) => !note.isDeleted).length);
	let totalMatchNotes = $derived(matchNotes.filter((note) => !note.isDeleted).length);
	let totalTeamNotes = $derived(teamNotes.filter((note) => !note.isDeleted).length);

	// Collapsible section states
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
		<div class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
			<div class="flex">
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error loading data</h3>
					<div class="mt-2 text-sm text-red-700 dark:text-red-300">
						<p>{error}</p>
					</div>
					<div class="mt-4">
						<button
							type="button"
							class="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 dark:bg-red-900/20 dark:text-red-200 dark:hover:bg-red-900/40"
							onclick={loadData}
						>
							Try again
						</button>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Summary Cards -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="bg-white overflow-hidden shadow rounded-lg dark:bg-gray-800">
				<div class="p-5">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
								<svg
									class="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
									Event Notes
								</dt>
								<dd class="text-lg font-medium text-gray-900 dark:text-white">{totalEventNotes}</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white overflow-hidden shadow rounded-lg dark:bg-gray-800">
				<div class="p-5">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
								<svg
									class="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
									Match Notes
								</dt>
								<dd class="text-lg font-medium text-gray-900 dark:text-white">{totalMatchNotes}</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white overflow-hidden shadow rounded-lg dark:bg-gray-800">
				<div class="p-5">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
								<svg
									class="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									></path>
								</svg>
							</div>
						</div>
						<div class="ml-5 w-0 flex-1">
							<dl>
								<dt class="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
									Team Notes
								</dt>
								<dd class="text-lg font-medium text-gray-900 dark:text-white">{totalTeamNotes}</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>
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
						<div class="text-center py-6 bg-gray-50 rounded-lg dark:bg-gray-800">
							<p class="text-sm text-gray-500 dark:text-gray-400">No practice matches scheduled</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each practiceSchedule as match (match.matchNumber)}
								<MatchCard {match} {matchNotes} {teamNotes} />
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
						<div class="text-center py-6 bg-gray-50 rounded-lg dark:bg-gray-800">
							<p class="text-sm text-gray-500 dark:text-gray-400">
								No qualification matches scheduled
							</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each qualificationSchedule as match (match.matchNumber)}
								<MatchCard {match} {matchNotes} {teamNotes} />
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
						<div class="text-center py-6 bg-gray-50 rounded-lg dark:bg-gray-800">
							<p class="text-sm text-gray-500 dark:text-gray-400">No playoff matches scheduled</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each playoffSchedule as match (match.matchNumber)}
								<MatchCard {match} {matchNotes} {teamNotes} />
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
</div>
