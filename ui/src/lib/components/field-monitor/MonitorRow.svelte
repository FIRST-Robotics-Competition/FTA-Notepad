<script lang="ts">
	import { AllianceType, DSStationStatus } from '../../../fms/fms-api';
	import type { FieldMonitorData } from '../../../fms/fms-signalr';

	interface MonitorRowProps {
		monitorFrame: FieldMonitorData;
		detailView: () => void;
	}

	let { monitorFrame, detailView = () => {} }: MonitorRowProps = $props();

	type DriverStationStatus =
		| 'Bypassed'
		| 'EStopped'
		| 'StationEstopPressed'
		| 'MoveStation'
		| 'WrongMatch'
		| 'EthActiveNoDs'
		| 'Good'
		| 'NoConnection';

	const DS_COLORS: Record<DriverStationStatus, string> = {
		NoConnection: 'bg-red-600',
		Good: 'bg-green-500 rounded-full',
		EthActiveNoDs: 'bg-green-500 rounded-full',
		WrongMatch: 'bg-yellow-400 rounded-full',
		MoveStation: 'bg-yellow-400 rounded-full',
		Bypassed: 'bg-red-700',
		EStopped: 'bg-neutral-900',
		StationEstopPressed: 'bg-neutral-900'
	};

	function dsStatus(): DriverStationStatus {
		if (monitorFrame.isBypassed) return 'Bypassed';
		if (monitorFrame.isEStopped) return 'EStopped';
		if (monitorFrame.isEStopPressed) return 'StationEstopPressed';
		if (monitorFrame.connection) {
			if (monitorFrame.dsLinkActive) return 'Good';
			if (monitorFrame.stationStatus === DSStationStatus.MoveStation) return 'MoveStation';
			if (monitorFrame.stationStatus === DSStationStatus.Waiting) return 'WrongMatch';
			return 'EthActiveNoDs';
		}
		return 'NoConnection';
	}

	const STATUS_COLORS: Record<'bad' | 'good', string> = {
		bad: 'bg-red-600',
		good: 'bg-green-500 rounded-full'
	};

	function batteryGraphColor() {
		if (!monitorFrame.battery) return '';
		return `background-color: rgba(255,0,0,${
			monitorFrame.battery < 11 && monitorFrame.battery > 0
				? (-1.5 * monitorFrame.battery ** 2 - 6.6 * monitorFrame.battery + 255) / 255
				: 0
		})`;
	}
</script>

<a
	href={'/notes/' + monitorFrame.teamNumber}
	class="fieldmonitor-square-height md:aspect-square flex items-center justify-center text-lg sm:text-2xl lg:text-4xl font-mono {monitorFrame.alliance ===
	AllianceType.Blue
		? 'bg-blue-500'
		: 'bg-red-500'}"
>
	<p>{monitorFrame.teamNumber}</p>
</a>
<button
	class="fieldmonitor-square-height md:aspect-square flex items-center justify-center font-mono text-4xl lg:text-8xl {DS_COLORS[
		dsStatus()
	]} text-black"
	onclick={() => detailView}
>
	{#if dsStatus() === 'EthActiveNoDs'}
		X
	{:else if dsStatus() === 'MoveStation'}
		M
	{:else if dsStatus() === 'WrongMatch'}
		W
	{:else if dsStatus() === 'Bypassed'}
		B
	{:else if dsStatus() === 'EStopped'}
		E
	{:else if dsStatus() === 'StationEstopPressed'}
		A
	{/if}
</button>
<button
	class="fieldmonitor-square-height md:aspect-square flex {STATUS_COLORS[
		monitorFrame.radioLink ? 'good' : 'bad'
	]}"
	onclick={() => detailView}
></button>
<button
	class="fieldmonitor-square-height md:aspect-square flex items-center justify-center font-mono text-4xl lg:text-8xl text-black {STATUS_COLORS[
		monitorFrame.radioLink ? 'good' : 'bad'
	]}"
	onclick={() => detailView}
>
	{#if monitorFrame.rioLink && !monitorFrame.linkActive}
		X
	{/if}
</button>
<button
	class="fieldmonitor-square-height p-0 relative aspect-square max-w-8 lg:max-w-32"
	onclick={() => detailView}
	style={batteryGraphColor()}
>
	<div class="text-center top-0 px-0.5 aspect-square">
		<!-- <Graph data={parsedData} min={0} max={8} time={20} /> -->
	</div>
	<div class="absolute w-full bottom-0 p-2 monitor-battery">
		{monitorFrame.battery?.toFixed(1)}v
	</div>
</button>
<button onclick={() => detailView} class="fieldmonitor-square-height hidden lg:flex items-end"
	>{monitorFrame.averageTripTime} ms</button
>
<button onclick={() => detailView} class="fieldmonitor-square-height hidden lg:flex items-end">
	{monitorFrame.dataRateTotal?.toFixed(2)} mbps
</button>
<button
	class="fieldmonitor-square-height hidden lg:flex p-0 relative aspect-square"
	onclick={() => detailView}
>
	<div class="text-center top-0 px-0.5 aspect-square">
		<!-- <Graph data={signalData} min={-140} max={100} time={20} /> -->
	</div>
	<div class="absolute w-full bottom-0 p-2 monitor-signal">
		{monitorFrame.signal ?? 0} dBm
	</div>
</button>
<button
	onclick={() => detailView}
	class="fieldmonitor-square-height lg:hidden flex flex-col items-end justify-center"
>
	<div>{monitorFrame.averageTripTime} ms</div>
	<div>{monitorFrame.dataRateTotal?.toFixed(2)}</div>
</button>
