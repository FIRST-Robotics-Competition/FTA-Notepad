<script lang="ts">
	import type { FieldMonitorData } from '../../fms/fms-signalr';
	import BatteryWidget from '$lib/field-monitor/battery/BatteryWidget.svelte';
	import RioWidget from '$lib/field-monitor/rio/RioWidget.svelte';
	import { WidgetID, type FieldMonitorConfig } from '$lib/field-monitor/widget';
	import BaseMonitorItem from './BaseMonitorItem.svelte';
	import RowBlock from './RowBlock.svelte';
	import { AllianceType } from '../../fms/fms-api';
	import { styles } from '$lib/styles';

	let { settings, data }: { settings: FieldMonitorConfig; data: FieldMonitorData } = $props();
	let num_widgets = settings.widgets.length;
</script>

<BaseMonitorItem
	extra_outer_classes={data.alliance == AllianceType.Blue
		? styles.alliance.blue.primary
		: styles.alliance.red.primary}>{data.teamNumber}</BaseMonitorItem
>
{#if data.isBypassed}
	<RowBlock {num_widgets}>Bypassed</RowBlock>
{:else}
	{#each settings.widgets as widget, index (index)}
		{#if widget.id == WidgetID.Battery}
			<BatteryWidget settings={widget.settings} {data} />
		{:else if widget.id == WidgetID.Rio}
			<RioWidget settings={widget.settings} {data} />
		{/if}
	{/each}
{/if}
