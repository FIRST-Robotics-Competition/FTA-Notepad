<script lang="ts">
	import Modal from '../Modal.svelte';
	import Button from '../Button.svelte';
	import {
		EventNoteIssueTypes,
		EventNoteResolutionTypes,
		TournamentLevel
	} from '$lib/api-client/fms-client';
	import type {
		CreateEventNoteRequest,
		CreateMatchNoteRequest,
		CreateTeamNoteRequest
	} from '$lib/api-client/fms-client';
	import { issueTypeOptions, resolutionStatusOptions } from '$lib/enum-formatters';
	interface AddNoteModalProps {
		isOpen: boolean;
		noteType: 'event' | 'match' | 'team';
		matchNumber?: number;
		tournamentLevel?: string;
		teamNumber?: number;
		onClose: () => void;
		onSubmit: (
			noteData: CreateEventNoteRequest | CreateMatchNoteRequest | CreateTeamNoteRequest
		) => Promise<void>;
	}

	let {
		isOpen = $bindable(),
		noteType,
		matchNumber,
		tournamentLevel,
		teamNumber,
		onClose,
		onSubmit
	}: AddNoteModalProps = $props();
	// Form state
	let note = $state('');
	let playNumber = $state(1);
	let issueType = $state(EventNoteIssueTypes.Other);
	let resolutionStatus = $state(EventNoteResolutionTypes.Open);
	let isSubmitting = $state(false);
	let submitError = $state<string | null>(null);

	// Form validation
	let isValid = $derived(note.trim().length > 0 && !isSubmitting);
	let isButtonDisabled = $derived(!isValid);
	// Modal title based on note type
	let title = $derived.by(() => {
		switch (noteType) {
			case 'event':
				return 'Add Event Note';
			case 'match':
				return `Add Note for Match ${matchNumber}`;
			case 'team':
				return `Add Note for Team ${teamNumber}`;
			default:
				return 'Add Note';
		}
	});
	async function handleSubmit() {
		if (!isValid) return;

		isSubmitting = true;
		submitError = null;

		try {
			let noteData: CreateEventNoteRequest | CreateMatchNoteRequest | CreateTeamNoteRequest;

			switch (noteType) {
				case 'event':
					noteData = { note: note.trim() } as CreateEventNoteRequest;
					break;
				case 'match':
					noteData = {
						note: note.trim(),
						tournamentLevel: tournamentLevel || '',
						matchNumber: matchNumber || 0,
						playNumber,
						teamNumber: teamNumber
					} as CreateMatchNoteRequest;
					break;
				case 'team':
					noteData = {
						noteText: note.trim(),
						teamNumber: teamNumber || 0,
						tournamentLevel: tournamentLevel
							? (tournamentLevel as keyof typeof TournamentLevel)
							: undefined,
						matchNumber: matchNumber,
						playNumber: matchNumber ? playNumber : undefined,
						issueType,
						resolutionStatus
					} as CreateTeamNoteRequest;
					break;
			}

			await onSubmit(noteData);
			handleCancel();
		} catch (error) {
			submitError = error instanceof Error ? error.message : 'Failed to create note';
		} finally {
			isSubmitting = false;
		}
	}
	function handleCancel() {
		note = '';
		playNumber = 1;
		issueType = EventNoteIssueTypes.Other;
		resolutionStatus = EventNoteResolutionTypes.Open;
		isSubmitting = false;
		submitError = null;
		isOpen = false;
		onClose();
	}
</script>

<Modal bind:open={isOpen} {title}>
	<div class="space-y-4">
		<!-- Error message -->
		{#if submitError}
			<div class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
				<p class="text-sm">{submitError}</p>
			</div>
		{/if}

		<!-- Note content (required for all types) -->
		<div>
			<label for="note" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
				Note
			</label>
			<textarea
				id="note"
				bind:value={note}
				rows="4"
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
				placeholder="Enter your note..."
				required
			></textarea>
		</div>

		<!-- Match-specific fields -->
		{#if noteType === 'match' || (noteType === 'team' && matchNumber)}
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label
						for="playNumber"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Play Number
					</label>
					<input
						id="playNumber"
						type="number"
						bind:value={playNumber}
						min="1"
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>
				</div>
				{#if noteType === 'match'}
					<div>
						<label
							for="teamNumberInput"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Team Number (optional)
						</label>
						<input
							id="teamNumberInput"
							type="number"
							bind:value={teamNumber}
							min="1"
							class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							placeholder="Leave blank for match-wide note"
						/>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Team-specific fields -->
		{#if noteType === 'team'}
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label
						for="issueType"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Issue Type
					</label>
					<select
						id="issueType"
						bind:value={issueType}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						{#each issueTypeOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>
				<div>
					<label
						for="resolutionStatus"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Resolution Status
					</label>
					<select
						id="resolutionStatus"
						bind:value={resolutionStatus}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						{#each resolutionStatusOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>
			</div>
		{/if}
		<!-- Action buttons -->
		<div class="flex justify-end space-x-3 pt-4">
			<Button color="gray" onclick={handleCancel} disabled={isSubmitting}>Cancel</Button>
			<Button color="primary" onclick={handleSubmit} disabled={isButtonDisabled}>
				{isSubmitting ? 'Adding...' : 'Add Note'}
			</Button>
		</div>
	</div>
</Modal>
