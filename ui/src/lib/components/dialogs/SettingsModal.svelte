<script lang="ts">
	import { get } from 'svelte/store';
	import Spinner from '../Spinner.svelte';
	import Modal from '../Modal.svelte';
	import Button from '../Button.svelte';
	import Toggle from '../Toggle.svelte';
	import { settingsStore } from '../../settings-store';
	import TextInput from '../TextInput.svelte';
	import { fmsClient } from '$lib/api-client/fms-client';
	import { onMount } from 'svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CheckCircle, ExclamationTriangle, SignalSlash } from '@steeze-ui/heroicons';

	export let settingsOpen = false;

	let settings = get(settingsStore);
	export let installPrompt: Event | null;

	let loading = false;

	enum CredentialsState {
		Valid,
		Invalid,
		Unknown
	}
	let credentialsState: CredentialsState = CredentialsState.Unknown;

	function updateSettings() {
		settingsStore.set(settings);
		checkCredentials();
	}

	async function checkCredentials() {
		credentialsState = CredentialsState.Unknown;
		credentialsState = await fmsClient
			.GET('/api/v{version}/FTA', {
				params: { path: { version: '1.0' } }
			})
			.then(({ response }): CredentialsState => {
				switch (response.status) {
					case 200:
						return CredentialsState.Valid;
					case 401:
						return CredentialsState.Invalid;
					default:
						return CredentialsState.Unknown;
				}
			})
			.catch((_) => {
				// In theory a 401 shouldn't get here, but they seem to be. Not sure why, but it means
				// we can't disambiguate not being on the field network from an auth failure right now.
				return CredentialsState.Invalid;
			});
	}

	function clearStorage() {
		localStorage.clear();
		window.location.reload();
	}

	onMount(checkCredentials);
</script>

<Spinner show={loading} />

<Modal bind:open={settingsOpen} size="lg" dismissable outsideclose title="Settings">
	<form class="justify-start text-left">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
			<Toggle bind:checked={settings.darkMode} onchange={updateSettings}>Dark Mode</Toggle>
			<Toggle bind:checked={settings.developerMode} onchange={updateSettings}>
				Developer Mode
			</Toggle>

			<div
				class="flex mt-3 items-center mx-auto space-x-2 sm:mt-0 sm:text-left md:mx-0 md:col-span-2"
			>
				<h3 class="text-base font-semibold leading-6">Credentials</h3>
				{#if credentialsState === CredentialsState.Valid}
					<Icon src={CheckCircle} theme="solid" class="fill-green-400" size="24" />
				{:else if credentialsState === CredentialsState.Invalid}
					<Icon src={ExclamationTriangle} theme="outline" class="stroke-red-400" size="24" />
				{:else if credentialsState === CredentialsState.Unknown}
					<Icon src={SignalSlash} theme="solid" class="fill-amber-400" size="24" />
				{/if}
			</div>

			<TextInput bind:text={settings.username} placeholder="JSmith" onblur={updateSettings}>
				Username
			</TextInput>

			<TextInput
				bind:text={settings.key}
				placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
				onblur={updateSettings}
			>
				API Key
			</TextInput>

			<TextInput bind:text={settings.fmsUrl} placeholder="http://localhost" onblur={updateSettings}>
				FMS URL
			</TextInput>

			<div class="grid gap-2 md:col-span-2 mt-2">
				{#if installPrompt}
					<Button
						color="primary"
						on:click={() => {
							// @ts-ignore
							if (installPrompt) installPrompt.prompt();
						}}>Install</Button
					>
				{/if}
				<Button on:click={clearStorage} color="red">Clear All Data</Button>
			</div>
		</div>
	</form>
	<div
		class="border-t border-neutral-500 pt-2 mt-4 flex flex-col text-center text-black dark:text-white"
	>
		<h1 class="text-lg">About</h1>
		<p>Version: {settings.version}</p>
		<a
			href="https://github.com/FIRST-Robotics-Competition/FTA-Notepad/"
			class="underline text-blue-400">GitHub</a
		>
	</div>
</Modal>
