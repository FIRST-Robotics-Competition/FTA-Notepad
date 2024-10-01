import createClient, { type Middleware } from 'openapi-fetch';
import type { paths, components } from '../../fms/fms-api';
import { settingsStore } from '$lib/settings-store';
import { get } from 'svelte/store';

export const fmsClient = createClient<paths>({ baseUrl: get(settingsStore).fmsUrl });

// TODO sync with FMS - not sure which API to use for that at the moment since `/FTA` seems to only
// return 0 for currentSeason
const season = 2025;

const authMiddleware: Middleware = {
	async onRequest({ request }) {
		let settings = get(settingsStore);
		let auth = btoa(`${settings.username}:${settings.key}`);
		request.headers.set('Authorization', `Basic ${auth}`);
		return request;
	}
};
fmsClient.use(authMiddleware);

export type TeamIssue = components['schemas']['TeamIssueModel'];
export async function getTeamNotes(
	fetch: any,
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
					eventCode: get(settingsStore).eventCode,
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

export async function getCurrentEventCode(): Promise<string | null | undefined> {
	const { data } = await fmsClient.GET('/api/v1.0/FTAAppApi/CurrentEventStatus', { fetch });
	return data?.eventCode;
}
