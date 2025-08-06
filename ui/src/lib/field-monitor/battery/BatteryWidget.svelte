<script lang="ts">
	import type { FieldMonitorData } from '../../../fms/fms-signalr';
	import BaseMonitorItem from '../BaseMonitorItem.svelte';
	import type { BatteryWidgetSettings } from './settings';

	let { data, settings }: { settings: BatteryWidgetSettings; data: FieldMonitorData } = $props();
</script>

<BaseMonitorItem>{data.battery}</BaseMonitorItem>
