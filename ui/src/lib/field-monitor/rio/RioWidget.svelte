<script lang="ts">
	import type { FieldMonitorData } from '../../../fms/fms-signalr';
	import BaseMonitorItem from '../BaseMonitorItem.svelte';
	import type { RioWidgetSettings } from './settings';

	let { settings, data }: { settings: RioWidgetSettings; data: FieldMonitorData } = $props();
</script>

<BaseMonitorItem>{data.rioLink}</BaseMonitorItem>
