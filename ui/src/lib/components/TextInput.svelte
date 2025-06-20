<script lang="ts">
	interface TextInputProps {
		text: string;
		placeholder?: string;
		children?: any;
		onblur?: () => void;
	}

	let {
		text = $bindable(''),
		placeholder = $bindable(''),
		children,
		onblur = () => {},
		...restProps
	}: TextInputProps = $props();
</script>

<div class="flex items-center">
	<span class="mr-3 text-sm flex-none">
		{@render children()}
	</span>

	<input
		{...restProps}
		type="text"
		bind:value={text}
		class="block flex-1 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-300 py-1.5 px-2 text-gray-900 dark:text-white placeholder:text-gray-400"
		{placeholder}
		{onblur}
	/>
</div>
