<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	export const ssr = false;

	let { children }: { children: Snippet } = $props();
</script>

{@render children()}
