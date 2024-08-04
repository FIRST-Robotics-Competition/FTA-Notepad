<script lang="ts">
	import { goto } from '$app/navigation';
	import { AllianceType, DSStationStatus, type FieldMonitorData } from '../../../fms/fms-signalr';
	import Graph from './Graph.svelte';

	interface MonitorRowProps {
        monitorFrame: FieldMonitorData;
		detailView: () => void;
	}

	let { monitorFrame, detailView = () => {} }: MonitorRowProps = $props();

	const DS_COLORS: { [key: number]: string } = {
		0: 'bg-red-600',
		1: 'bg-green-500 rounded-full',
		2: 'bg-green-500 rounded-full',
		3: 'bg-yellow-400 rounded-full',
		4: 'bg-yellow-400 rounded-full',
		5: 'bg-red-700',
		6: 'bg-neutral-900',
		7: 'bg-neutral-900'
	};



    function dsStatus() {
        if (monitorFrame.isBypassed) return 5;
        if (monitorFrame.isEStopped) return 6;
        if (monitorFrame.isEStopPressed) return 7;
        if (monitorFrame.connection) {
            if (monitorFrame.dsLinkActive) return 1;
            if (monitorFrame.stationStatus === DSStationStatus.MoveStation) return 3;
            if (monitorFrame.stationStatus === DSStationStatus.Waiting) return 4;
            return 2;
        }
        return 0
    }

	const STATUS_COLORS: { [key: number]: string } = {
		0: 'bg-red-600',
		1: 'bg-green-500 rounded-full'
	};

    function stationKey() {
        return (monitorFrame.alliance ? 'red':'blue') + monitorFrame.station;
    }

    function batteryGraphColor() {
        if (!monitorFrame.battery) return "";
        return `background-color: rgba(255,0,0,${monitorFrame.battery < 11 && monitorFrame.battery > 0
			? (-1.5 * monitorFrame.battery ** 2 - 6.6 * monitorFrame.battery + 255) / 255
			: 0})`;
    }
</script>

<div class="grid grid-flow-col md:gap-1 justify-center cursor-pointer max-w-max" id="{stationKey()}-row"
	>
        <a
            href={"/notes/" + monitorFrame.teamNumber}
            class="h-full px-2 lg:aspect-square flex items-center justify-center p-.5 md:p-1 lg:p-2 lg:text-4xl font-mono ring-inset ring-1 ring-gray-800 {monitorFrame.alliance === AllianceType.Blue ? 'bg-blue-500' : 'bg-red-500'}"
        >
            <p>{monitorFrame.teamNumber}</p>
    </a>
	<button
		class="h-full aspect-third lg:aspect-square flex items-center justify-center font-mono p-.5 text-4xl md:p-1 lg:p-2 lg:text-8xl {DS_COLORS[dsStatus()]} text-black ring-inset ring-1 ring-gray-800"
		onclick={() => detailView}
	>
		{#if dsStatus() === 2}
			X
		{:else if dsStatus() === 3}
			M
		{:else if dsStatus() === 4}
			W
		{:else if dsStatus() === 5}
			B
		{:else if dsStatus() === 6}
			E
		{:else if dsStatus() === 7}
			A
		{/if}
    </button>
	<button
		class="h-full aspect-third lg:aspect-square flex {STATUS_COLORS[monitorFrame.radioLink ? 1 : 0]} ring-inset ring-1 ring-gray-800"
		onclick={() => detailView}
	></button>
	<button
		class="h-full aspect-third lg:aspect-square flex items-center justify-center  font-mono p-.5 md:p-1 text-4xl lg:p-2 lg:text-8xl text-black {STATUS_COLORS[monitorFrame.radioLink ? 1 : 0]} ring-inset ring-1 ring-gray-800"
		onclick={() => detailView}
	>
        {#if monitorFrame.rioLink && !monitorFrame.linkActive}
            X
        {/if}
    </button>
	<button
		class="h-full p-0 relative aspect-square"
		onclick={() => detailView}
		style={batteryGraphColor()}
	>
		<div class="text-center top-0 px-0.5 aspect-square">
			<!-- <Graph data={parsedData} min={0} max={8} time={20} /> -->
		</div>
		<div
			class="absolute w-full bottom-0 p-2 monitor-battery"
		>
			{monitorFrame.battery?.toFixed(1)}v
		</div>
	</button>
    <button onclick={() => detailView} class="h-full hidden lg:flex aspect-square items-center justify-center p-.5 md:p-1 lg:p-2">{monitorFrame.averageTripTime} ms</button>
    <button onclick={() => detailView} class="h-full hidden lg:flex aspect-square items-center justify-center p-.5 md:p-1 lg:p-2">
        {monitorFrame.dataRateTotal?.toFixed(2)} mbps
    </button>
    <button class="h-full hidden lg:flex p-0 relative aspect-square" onclick={() => detailView}>
        <div class="text-center top-0 px-0.5 aspect-square">
            <!-- <Graph data={signalData} min={-140} max={100} time={20} /> -->
        </div>
        <div class="absolute w-full bottom-0 p-2 monitor-signal">
            {monitorFrame.signal ? monitorFrame.signal : 0} dBm
        </div>
    </button>
    <div class="h-full lg:hidden">
		<button onclick={() => detailView} class="aspect-square flex flex-col items-center justify-center p-.5 md:p-1 lg:p-2">
			<div>{monitorFrame.averageTripTime} ms</div>
			<div>{monitorFrame.dataRateTotal?.toFixed(2)} mbps</div>
			<div>{monitorFrame.signal ? monitorFrame.signal : 0} dBm</div>
		</button>
    </div>
</div>
