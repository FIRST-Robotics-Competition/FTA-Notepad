<script lang="ts">
	import { AllianceType, DSStationStatus, MonitorStatusType, StationType, type FieldMonitorData } from "../fms/fms-signalr";
    import MonitorRow from "../lib/components/field-monitor/MonitorRow.svelte";

    let teams: FieldMonitorData[] = [
        {
            teamNumber: 5678,
            alliance: AllianceType.Blue,
            station: StationType.Station1,
            connection: false,
            dsLinkActive: false,
            radioLink: false,
            rioLink: false,
            linkActive: false,
            isEnabled: false,
            isAuto: false,
            isBypassed: false,
            isEStopPressed: false,
            isEStopped: false,
            battery: 0,
            monitorStatus: MonitorStatusType.Unknown,
            averageTripTime: 0,
            lostPackets: 0,
            signal: 0,
            dataRateTotal: 0,
            stationStatus: DSStationStatus.Unknown
        },
        {
            teamNumber: 9876,
            alliance: AllianceType.Blue,
            station: StationType.Station2,
            connection: true,
            dsLinkActive: false,
            radioLink: false,
            rioLink: false,
            linkActive: false,
            isEnabled: false,
            isAuto: false,
            isBypassed: false,
            isEStopPressed: false,
            isEStopped: false,
            battery: 0,
            monitorStatus: MonitorStatusType.Unknown,
            averageTripTime: 0,
            lostPackets: 0,
            signal: 0,
            dataRateTotal: 0,
            stationStatus: DSStationStatus.Unknown
        },
        {
            teamNumber: 4321,
            alliance: AllianceType.Blue,
            station: StationType.Station3,
            connection: true,
            dsLinkActive: false,
            radioLink: false,
            rioLink: false,
            linkActive: false,
            isEnabled: false,
            isAuto: false,
            isBypassed: false,
            isEStopPressed: false,
            isEStopped: false,
            battery: 0,
            monitorStatus: MonitorStatusType.Unknown,
            averageTripTime: 0,
            lostPackets: 0,
            signal: 0,
            dataRateTotal: 0,
            stationStatus: DSStationStatus.Waiting
        },
        {
            teamNumber: 2468,
            alliance: AllianceType.Red,
            station: StationType.Station1,
            connection: true,
            dsLinkActive: true,
            radioLink: false,
            rioLink: false,
            linkActive: false,
            isEnabled: false,
            isAuto: false,
            isBypassed: false,
            isEStopPressed: false,
            isEStopped: false,
            battery: 0,
            monitorStatus: MonitorStatusType.Unknown,
            averageTripTime: 0,
            lostPackets: 0,
            signal: 0,
            dataRateTotal: 0,
            stationStatus: DSStationStatus.Unknown
        },
        {
            teamNumber: 1357,
            alliance: AllianceType.Red,
            station: StationType.Station2,
            connection: true,
            dsLinkActive: true,
            radioLink: true,
            rioLink: true,
            linkActive: false,
            isEnabled: false,
            isAuto: false,
            isBypassed: false,
            isEStopPressed: false,
            isEStopped: false,
            battery: 0,
            monitorStatus: MonitorStatusType.Unknown,
            averageTripTime: 0,
            lostPackets: 0,
            signal: 0,
            dataRateTotal: 0,
            stationStatus: DSStationStatus.Unknown
        },
        {
            teamNumber: 3242,
            alliance: AllianceType.Red,
            station: StationType.Station3,
            connection: true,
            dsLinkActive: true,
            radioLink: true,
            rioLink: true,
            linkActive: true,
            isEnabled: false,
            isAuto: false,
            isBypassed: false,
            isEStopPressed: false,
            isEStopped: false,
            battery: 0,
            monitorStatus: MonitorStatusType.Unknown,
            averageTripTime: 0,
            lostPackets: 0,
            signal: 0,
            dataRateTotal: 0,
            stationStatus: DSStationStatus.Unknown
        }
    ];

    let detailView = () => {};
</script>

<div class="grid grid-cols-fieldmonitor lg:grid-cols-fieldmonitor-large gap-0.5 md:gap-1 mx-auto justify-center">
    <MonitorRow monitorFrame={teams[0]} station="blue1" detailView={detailView} />
    <MonitorRow monitorFrame={teams[1]} station="blue2" detailView={detailView} />
    <MonitorRow monitorFrame={teams[2]} station="blue3" detailView={detailView} />
    <MonitorRow monitorFrame={teams[3]} station="red1" detailView={detailView} />
    <MonitorRow monitorFrame={teams[4]} station="red2" detailView={detailView} />
    <MonitorRow monitorFrame={teams[5]} station="red3" detailView={detailView} />
</div>