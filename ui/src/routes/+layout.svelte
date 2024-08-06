<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import '../app.css';
    import { XMark, Bars3, Clipboard, Cog6Tooth, Tv, DocumentText, ChatBubbleBottomCenterText, ArchiveBox, Icon, InformationCircle, AcademicCap } from 'svelte-hero-icons';
	import SettingsModal from '../lib/components/dialogs/SettingsModal.svelte';
    import { browser } from '$app/environment';
	import { settingsStore } from '$lib/settings-store';

	export const ssr = false;

	let { children }: { children: Snippet } = $props();

    let sidebarOpen = $state(false);
    let settingsOpen = $state(false);

    let root: HTMLElement | null = null;
    let darkMode = $state($settingsStore.darkMode);

    onMount(() => {
        root = document.documentElement;
        root.classList.toggle('dark', darkMode);
    });

    $effect(() => {
        settingsStore.subscribe((settings) => {
            darkMode = settings.darkMode;
            if (root) root.classList.toggle('dark', darkMode);
        });
    });

    // App install prompt
    let installPrompt: Event | null = $state(null);

    if (browser) {
        window.addEventListener("beforeinstallprompt", (event) => {
            event.preventDefault();
            installPrompt = event;
        });

        window.addEventListener("appinstalled", () => {
            installPrompt = null;
        });
    }
</script>

<SettingsModal bind:settingsOpen bind:installPrompt />

<div>
	<!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
	<div class="relative z-10 lg:hidden" role="dialog" aria-modal="true">
		<!-- Off-canvas menu backdrop, show/hide based on off-canvas menu state. -->
		<div class="fixed inset-0 bg-gray-900/80 transition-opacity ease-linear duration-300 {sidebarOpen ? "opacity-100" : "opacity-0 collapse"}" aria-hidden="true"></div>

		<div class="fixed inset-0 flex transition ease-in-out duration-300 transform {sidebarOpen ? "translate-x-0" : "-translate-x-full"}">
			<!-- Off-canvas menu, show/hide based on off-canvas menu state. -->
			<div class="relative mr-16 flex w-full max-w-xs flex-1">
				<!-- Close button, show/hide based on off-canvas menu state. -->
				<div class="absolute left-full top-0 flex w-16 justify-center pt-5 ease-in-out duration-300 {sidebarOpen ? "opacity-100" : "opacity-0"}">
					<button type="button" class="-m-2.5 p-2.5" onclick={() => { sidebarOpen = false }}>
						<span class="sr-only">Close sidebar</span>
                        <Icon src={XMark} class="h-8 w-8" />
					</button>
				</div>

				<!-- Sidebar component -->
				<div class="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-600 text-white px-6 pb-2">
					<div class="flex h-16 shrink-0 items-center font-semibold text-xl">
                        FTA Notepad
					</div>
					<nav class="flex flex-1 flex-col">
						<ul role="list" class="flex flex-1 flex-col gap-y-2">
							<li>
								<ul role="list" class="-mx-2 space-y-1">
									<li>
										<a
											href="#"
											class="group flex gap-x-3 rounded-md p-2 font-semibold leading-8 hover:bg-primary-700 bg-primary-700"
										>
                                            <Icon src={Tv} class="h-8 w-8 shrink-0" />
											Field Monitor
										</a>
									</li>
									<li>
										<a
											href="#"
											class="group flex gap-x-3 rounded-md p-2 font-semibold leading-8 hover:bg-primary-700 data-[active=true]:bg-primary-700"
										>
                                            <Icon src={AcademicCap} class="h-8 w-8 shrink-0" />
                                            Flashcards
										</a>
									</li>
                                    <li>
                                        <a
                                            href="#"
                                            class="group flex gap-x-3 rounded-md p-2 font-semibold leading-8 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                        >
                                            <Icon src={DocumentText} class="h-8 w-8 shrink-0" />
                                            References
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            class="group flex gap-x-3 rounded-md p-2 font-semibold leading-8 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                        >
                                            <Icon src={ChatBubbleBottomCenterText} class="h-8 w-8 shrink-0" />
                                            Tickets & Notes
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            class="group flex gap-x-3 rounded-md p-2 font-semibold leading-8 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                        >
                                            <Icon src={ArchiveBox} class="h-8 w-8 shrink-0" />
                                            Match Logs
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            class="group flex gap-x-3 rounded-md p-2 font-semibold leading-8 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                        >
                                            <Icon src={Clipboard} class="h-8 w-8 shrink-0" />
                                            Checklist
                                        </a>
                                    </li>
								</ul>
							</li>
							<li class="border-t border-white">
								<ul role="list" class="-mx-2 mt-2 space-y-1">
									<li>
										<a
											href="#"
											class="group flex gap-x-3 rounded-md p-2 font-semibold leading-8 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                            onclick={() => settingsOpen = true}
										>
                                            <Icon src={Cog6Tooth} class="h-8 w-8 shrink-0" />
											Settings
										</a>
									</li>
									<li>
										<a
											href="#"
											class="group flex gap-x-3 rounded-md p-2 font-semibold leading-8 hover:bg-primary-700 data-[active=true]:bg-primary-700"
										>
                                            <Icon src={InformationCircle} class="h-8 w-8 shrink-0" />
											Help
										</a>
									</li>
								</ul>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	</div>

	<!-- Static sidebar for desktop -->
	<div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
		<!-- Sidebar component -->
		<div class="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-600 text-white px-6">
			<div class="flex h-16 shrink-0 items-center font-semibold text-xl">
                FTA Notepad
			</div>
			<nav class="flex flex-1 flex-col">
				<ul role="list" class="flex flex-1 flex-col gap-y-2">
					<li>
						<ul role="list" class="-mx-2 space-y-1">
                            <li>
                                <a
                                    href="#"
                                    class="group flex gap-x-3 rounded-md p-2 font-semibold leading-6 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                    data-active="true"
                                >
                                    <Icon src={Tv} class="h-6 w-6 shrink-0" />
                                    Field Monitor
                                </a>
                            </li>
                            <!-- <li>
                                <a
                                    href="#"
                                    class="group flex gap-x-3 rounded-md p-2 font-semibold leading-6 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                >
                                    <Icon src={AcademicCap} class="h-6 w-6 shrink-0" />
                                    Flashcards
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="group flex gap-x-3 rounded-md p-2 font-semibold leading-6 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                >
                                    <Icon src={DocumentText} class="h-6 w-6 shrink-0" />
                                    References
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="group flex gap-x-3 rounded-md p-2 font-semibold leading-6 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                >
                                    <Icon src={ChatBubbleBottomCenterText} class="h-6 w-6 shrink-0" />
                                    Tickets & Notes
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="group flex gap-x-3 rounded-md p-2 font-semibold leading-6 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                >
                                    <Icon src={ArchiveBox} class="h-6 w-6 shrink-0" />
                                    Match Logs
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="group flex gap-x-3 rounded-md p-2 font-semibold leading-6 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                >
                                    <Icon src={Clipboard} class="h-6 w-6 shrink-0" />
                                    Checklist
                                </a>
                            </li> -->
						</ul>
					</li>
                    <li class="border-t border-white">
                        <ul role="list" class="-mx-2 mt-2 space-y-1">
                            <li>
                                <a
                                    href="#"
                                    class="group flex gap-x-3 rounded-md p-2 font-semibold leading-6 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                    onclick={() => settingsOpen = true}
                                >
                                    <Icon src={Cog6Tooth} class="h-6 w-6 shrink-0" />
                                    Settings
                                </a>
                            </li>
                            <!-- <li>
                                <a
                                    href="#"
                                    class="group flex gap-x-3 rounded-md p-2 font-semibold leading-6 hover:bg-primary-700 data-[active=true]:bg-primary-700"
                                >
                                    <Icon src={InformationCircle} class="h-6 w-6 shrink-0" />
                                    Help
                                </a>
                            </li> -->
                        </ul>
                    </li>
					<li class="-mx-6 mt-auto">
						<a
							href="#"
							class="flex items-center gap-x-4 px-6 py-3 font-semibold leading-6 hover:bg-indigo-700"
						>
							<img
								class="h-6 w-6 rounded-full bg-indigo-700"
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
							/>
							<span class="sr-only">Your profile</span>
							<span aria-hidden="true">Tom Cook</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</div>

	<div
		class="sticky top-0 flex items-center gap-x-2 md:gap-x-6 bg-primary-600 px-1 md:px-4 py-1 shadow-sm sm:px-6 lg:py-4 lg:hidden"
	>
		<button type="button" class="-m-2.5 p-2.5 lg:hidden" onclick={() => {sidebarOpen = !sidebarOpen}}>
			<span class="sr-only">Open sidebar</span>
            <Icon src={Bars3} class="h-8 w-8" />
		</button>
		<div class="flex-1 font-semibold leading-8">Field Monitor</div> <!-- TODO: dynamic title on mobile -->
		<a href="#">
			<span class="sr-only">Your profile</span>
			<img
				class="h-8 w-8 rounded-full bg-primary-700"
				src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
		</a>
	</div>

	<main class="py-2 lg:py-10 lg:pl-72">
		<div class="px-2 sm:px-6 lg:px-8">
			{@render children()}
		</div>
	</main>
</div>
