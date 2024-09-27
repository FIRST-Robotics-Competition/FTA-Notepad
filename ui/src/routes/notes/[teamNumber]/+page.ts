import { getTeamNotes } from '$lib/api-client/fms-client.js';

export async function load({ fetch, params }) {
	const { notes, error, response } = await getTeamNotes(fetch, {
		teamNumber: parseInt(params.teamNumber)
	});

	return {
		notes,
		notesError: {
			status: response.status,
			message: error
		}
	};
}
