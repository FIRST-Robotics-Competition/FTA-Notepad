<script lang="ts">
	import BatteryWidget from "$lib/field-monitor/battery/BatteryWidget.svelte";
	import RioWidget from "$lib/field-monitor/rio/RioWidget.svelte";
    import {widget_config} from "$lib/field-monitor/widget"
    import {WidgetID} from "$lib/field-monitor/widget"
	import { Blue1Default } from "../defaults";

</script>


{#each widget_config as widget, index (index)}
    {#if widget.id == WidgetID.Battery}
        <BatteryWidget settings={widget.settings} data={Blue1Default} />
    {:else if widget.id == WidgetID.Rio}
        <RioWidget settings={widget.settings} data={Blue1Default} />
    {/if}
{/each}
