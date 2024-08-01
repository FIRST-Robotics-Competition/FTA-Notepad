<script lang="ts">
    import { get } from "svelte/store";
    import Spinner from "../Spinner.svelte";
	import Modal from "../Modal.svelte";
	import Button from "../Button.svelte";
	import Toggle from "../Toggle.svelte";
	import { settingsStore } from "../../settings-store";

    export let settingsOpen = false;

    let settings = get(settingsStore);
    export let installPrompt: Event | null;

    let loading = false;

    function updateSettings() {
        console.log(settings);
        settingsStore.set(settings);
    }

    function clearStorage() {
        localStorage.clear();
        window.location.reload();
    }
</script>

<Spinner show={loading}/>

<Modal bind:open={settingsOpen} size="lg" dismissable outsideclose title="Settings">
    <form class="justify-start text-left">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Toggle bind:checked={settings.darkMode} onchange={updateSettings}>Dark Mode</Toggle>
            <Toggle bind:checked={settings.developerMode} onchange={updateSettings}>Developer Mode</Toggle>
       
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
    <div class="border-t border-neutral-500 pt-2 mt-4 flex flex-col text-center text-black dark:text-white">
        <h1 class="text-lg">About</h1>
        <p>Version: {settings.version}</p>
        <a href="https://github.com/FIRST-Robotics-Competition/FTA-Notepad/" class="underline text-blue-400">GitHub</a>
    </div>
</Modal>