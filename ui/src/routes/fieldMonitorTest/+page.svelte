<script lang="ts">
	import { Blue1Default } from '$lib/defaults';
	import MonitorHeader from '$lib/field-monitor/MonitorHeader.svelte';
	import MonitorRow from '$lib/field-monitor/MonitorRow.svelte';
	import { field_monitor_config } from '$lib/field-monitor/widget';
</script>

<MonitorHeader />
<div class="grid h-full w-full content-stretch grid-rows-fieldmonitor">
	<div class="row-1">Team Number</div>
	{#each field_monitor_config.widgets as widget, index (index)}
		<div class="row-1">{widget.id}</div>
	{/each}

	{#each { length: 6 }}
		<MonitorRow settings={field_monitor_config} data={Blue1Default} />
	{/each}
</div>
