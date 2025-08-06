<script lang="ts">
	import { type Snippet } from 'svelte';

	interface BaseMonitorItemProps {
		extra_outer_classes?: string;
		num_widgets: number;
		children: Snippet;
	}

	let { extra_outer_classes, num_widgets, children }: BaseMonitorItemProps = $props();
</script>

<div
	class="{`col-span-${num_widgets}`} flex items-center justify-center h-fill {extra_outer_classes}"
>
	<p class="min-m-1 flex items-center justify-center text-center text-[min(8vh,40pt)]">
		{@render children()}
	</p>
</div>
