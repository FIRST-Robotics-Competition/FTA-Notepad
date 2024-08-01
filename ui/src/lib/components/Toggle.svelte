<script lang="ts">
	interface ToggleProps {
		checked: boolean;
		children?: any;
        onchange?: (checked: boolean) => void;
	}

	let { 
        checked = $bindable(false),
        children,
        onchange = () => {},
        ...restProps
    }: ToggleProps = $props();

    function change() {
        checked = !checked;
        void onchange(checked);
    }
</script>

<div class="flex items-center">
	<button
        {...restProps}
		type="button"
		class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 {checked
			? 'bg-primary-600'
			: 'bg-gray-200 dark:bg-neutral-600'}"
		role="switch"
		aria-checked={checked}
        onclick={change}
	>
		<span class="sr-only">Use setting</span>
		<span
			aria-hidden="true"
			class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out {checked
				? 'translate-x-5'
				: 'translate-x-0'}"
		></span>
	</button>
	<span class="ml-3 text-sm">
		{@render children()}
	</span>
</div>
