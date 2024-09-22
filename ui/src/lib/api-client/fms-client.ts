import createClient, { type Middleware } from 'openapi-fetch';
import type { paths, components } from '../../fms/fms-api';
import { settingsStore } from '$lib/settings-store';
import { get } from 'svelte/store';

// TODO configure with real FMS URL (and local dev option)
export const fmsClient = createClient<paths>({ baseUrl: 'http://localhost' });

const authMiddleware: Middleware = {
	async onRequest({ request }) {
		let settings = get(settingsStore);
		let auth = btoa(`${settings.username}:${settings.key}`);
		request.headers.set('Authorization', `Basic ${auth}`);
		return request;
	}
};
fmsClient.use(authMiddleware);
