<script lang="ts">
	import { type Snippet } from 'svelte';

	interface BaseMonitorItemProps {
		extra_outer_classes?: string;
		children: Snippet;
	}

	let { extra_outer_classes, children }: BaseMonitorItemProps = $props();
</script>

<div class="flex items-center justify-center h-fill {extra_outer_classes}">
	<p class="min-m-1 flex items-center justify-center text-center text-[min(8vh,40pt)]">
		{@render children()}
	</p>
</div>
