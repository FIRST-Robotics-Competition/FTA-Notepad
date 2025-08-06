<script lang="ts">
	import type { FieldMonitorData } from "../../../fms/fms-signalr";
	import type { BatteryWidgetSettings } from "./settings";

    let props: {settings: BatteryWidgetSettings, data: FieldMonitorData} = $props();
</script>

<div>Battery: {JSON.stringify(props)}</div>
