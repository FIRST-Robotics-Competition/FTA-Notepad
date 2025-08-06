<script lang="ts">
	import type { FieldMonitorData } from "../../../fms/fms-signalr";
	import type { RioWidgetSettings } from "./settings";

    let props: {settings: RioWidgetSettings, data: FieldMonitorData} = $props();
</script>

<div>Rio: {JSON.stringify(props)}</div>
