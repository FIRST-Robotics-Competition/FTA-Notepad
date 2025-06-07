import createClient, { type Middleware } from 'openapi-fetch';
import type { paths, components } from '../../fms/fms-api';
import { TournamentLevel } from '../../fms/fms-api';
import { settingsStore } from '$lib/settings-store';
import { get } from 'svelte/store';

export const fmsClient = createClient<paths>({ baseUrl: get(settingsStore).fmsUrl });

// TODO sync with FMS - not sure which API to use for that at the moment since `/FTA` seems to only
// return 0 for currentSeason
const season = 2025;

const authMiddleware: Middleware = {
	async onRequest({ request }) {
		const settings = get(settingsStore);
		const auth = btoa(`${settings.username}:${settings.key}`);
		request.headers.set('Authorization', `Basic ${auth}`);
		return request;
	}
};
fmsClient.use(authMiddleware);

// Type exports
export type TeamIssue = components['schemas']['TeamIssueModel'];
export type EventNote = components['schemas']['EventNoteModel'];
export type MatchNote = components['schemas']['MatchNoteModel'];
export type ScheduledMatch = components['schemas']['ScheduledMatchModel'];
export type EventSchedule = components['schemas']['EventScheduleModel'];

// Team Issues/Notes API
export async function getTeamNotes(
	fetch: typeof globalThis.fetch,
	options: {
		noteId?: string;
		teamNumber?: number;
		issueType?: components['schemas']['EventNoteIssueTypes'];
		resolutionStatus?: components['schemas']['EventNoteResolutionTypes'];
	}
) {
	const { data, error, response } = await fmsClient.GET(
		'/api/v1.0/FTA/{season}/{eventCode}/teamIssues',
		{
			params: {
				query: options,
				path: {
					season: season,
					eventCode: get(settingsStore).eventCode
				}
			},
			fetch
		}
	);

	return {
		notes: data?.teamIssues,
		error: error,
		response
	};
}

export async function getCurrentEventCode(
	fetch: typeof globalThis.fetch
): Promise<string | null | undefined> {
	const { data } = await fmsClient.GET('/api/v1.0/FTAAppApi/CurrentEventStatus', { fetch });
	return data?.eventCode;
}

// Event Notes API
export async function getEventNotes(fetch: typeof globalThis.fetch) {
	const { data, error, response } = await fmsClient.GET(
		'/api/v1.0/FTA/{season}/{eventCode}/eventNotes',
		{
			params: {
				path: {
					season: season,
					eventCode: get(settingsStore).eventCode
				}
			},
			fetch
		}
	);

	return {
		notes: data?.eventNotes,
		error: error,
		response
	};
}

// Match Notes API
export async function getMatchNotes(
	fetch: typeof globalThis.fetch,
	options?: {
		noteId?: string;
		tournamentLevel?: components['schemas']['TournamentLevel'];
		matchNumber?: number;
		playNumber?: number;
		teamNumber?: number;
	}
) {
	const { data, error, response } = await fmsClient.GET(
		'/api/v1.0/FTA/{season}/{eventCode}/matchNotes',
		{
			params: {
				query: options,
				path: {
					season: season,
					eventCode: get(settingsStore).eventCode
				}
			},
			fetch
		}
	);

	return {
		notes: data?.matchNotes,
		error: error,
		response
	};
}

// Schedule API
export async function getEventSchedule(
	fetch: typeof globalThis.fetch,
	tournamentLevel: components['schemas']['TournamentLevel'] = TournamentLevel.Qualification
) {
	const { data, error, response } = await fmsClient.GET(
		'/api/v1.0/FTA/{season}/{eventCode}/schedule/{tournamentLevel}',
		{
			params: {
				path: {
					season: season,
					eventCode: get(settingsStore).eventCode,
					tournamentLevel: tournamentLevel
				}
			},
			fetch
		}
	);

	return {
		schedule: data?.Schedule,
		error: error,
		response
	};
}

// Get current event info
export function getCurrentEvent() {
	const settings = get(settingsStore);
	return {
		eventCode: settings.eventCode,
		season: season
	};
}

// Helper functions for counting notes
export async function getNoteCounts(fetch: typeof globalThis.fetch) {
	const [eventNotesResult, matchNotesResult, teamNotesResult] = await Promise.all([
		getEventNotes(fetch),
		getMatchNotes(fetch),
		getTeamNotes(fetch, {})
	]);

	return {
		eventNotes: eventNotesResult.notes || [],
		matchNotes: matchNotesResult.notes || [],
		teamNotes: teamNotesResult.notes || [],
		errors: [eventNotesResult.error, matchNotesResult.error, teamNotesResult.error].filter(Boolean)
	};
}

export function countMatchNotes(
	matchNotes: MatchNote[],
	matchNumber: number,
	tournamentLevel: string
) {
	return matchNotes.filter(
		(note) =>
			note.matchNumber === matchNumber &&
			note.tournamentLevel === tournamentLevel &&
			!note.isDeleted
	).length;
}

export function countTeamNotes(
	teamNotes: TeamIssue[],
	teamNumber: number,
	matchNumber?: number,
	tournamentLevel?: string
) {
	return teamNotes.filter((note) => {
		if (note.teamNumber !== teamNumber || note.isDeleted) return false;

		// If match-specific, filter by match and tournament level
		if (matchNumber !== undefined && tournamentLevel !== undefined) {
			return note.matchNumber === matchNumber && note.tournamentLevel === tournamentLevel;
		}

		// Otherwise, count all notes for this team
		return true;
	}).length;
}

export function countTeamMatchSpecificNotes(
	teamNotes: TeamIssue[],
	teamNumber: number,
	matchNumber: number,
	tournamentLevel: string
) {
	return teamNotes.filter(
		(note) =>
			note.teamNumber === teamNumber &&
			note.matchNumber === matchNumber &&
			note.tournamentLevel === tournamentLevel &&
			!note.isDeleted
	).length;
}

export function countTeamGeneralNotes(teamNotes: TeamIssue[], teamNumber: number) {
	return teamNotes.filter(
		(note) =>
			note.teamNumber === teamNumber &&
			!note.matchNumber && // General team notes don't have a match number
			!note.isDeleted
	).length;
}
