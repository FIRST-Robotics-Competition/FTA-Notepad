import createClient, { type Middleware } from 'openapi-fetch';
import type { paths, components } from '../../fms/fms-api';
import { settingsStore } from '$lib/settings-store';
import { get } from 'svelte/store';

export const fmsClient = createClient<paths>({ baseUrl: get(settingsStore).fmsUrl });
const apiVersion = '1.0';

// TODO sync with FMS - not sure which API to use for that at the moment since `/FTA` seems to only
// return 0 for currentSeason
const season = 2025;

const authMiddleware: Middleware = {
	async onRequest({ request }) {
		console.log(request.url);
		let settings = get(settingsStore);
		let auth = btoa(`${settings.username}:${settings.key}`);
		request.headers.set('Authorization', `Basic ${auth}`);
		return request;
	}
};
fmsClient.use(authMiddleware);

// Our swagger specs have some parameters defined as query parameters, but also include those parameters as
// part of the path. Those path parameters cannot be replaced correctly, so we will need to strip them out.
const fixPathsMiddleware: Middleware = {
	async onRequest({ request }) {
		console.log('original: ' + request.url);
		// Strip any path parameters that haven't been provided
		// E.g. /teamIssues/{noteId} becomes /teamIssues
		let fixedUrl = request.url.replace(/\/%7B\w*%7D/g, '');
		return new Request(fixedUrl, request);
	}
};
fmsClient.use(fixPathsMiddleware);

export type TeamIssue = components['schemas']['TeamIssueModel'];
export interface FetchTeamIssueOptions {
	noteId?: string;
	teamNumber?: number;
	issueType?: string;
	resolutionStatus?: string;
}
export async function getTeamNotes(
	fetch: any,
	options: {
		noteId?: string;
		teamNumber?: number;
		issueType?: string;
		resolutionStatus?: string;
	}
) {
	const { data, error, response } = await fmsClient.GET(
		'/api/v{version}/FTA/{season}/{eventCode}/teamIssues/{noteId}/{teamNumber}/{issueType}/{resolutionStatus}',
		{
			params: {
				query: options,
				path: {
					season: season,
					eventCode: get(settingsStore).eventCode,
					version: apiVersion
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
