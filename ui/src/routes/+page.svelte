<script lang="ts">
	import { AllianceType, StationType, MatchStateType } from '../fms/fms-api';
	import { connectFieldMonitor, type FieldMonitorData } from '../fms/fms-signalr';
	import MonitorRow from '../lib/components/field-monitor/MonitorRow.svelte';
	import {
		Blue1Default,
		Blue2Default,
		Blue3Default,
		Red1Default,
		Red2Default,
		Red3Default
	} from './defaults';
	import { settingsStore } from '$lib/settings-store';

	let blue1: FieldMonitorData = Blue1Default;
	let blue2: FieldMonitorData = Blue2Default;
	let blue3: FieldMonitorData = Blue3Default;
	let red1: FieldMonitorData = Red1Default;
	let red2: FieldMonitorData = Red2Default;
	let red3: FieldMonitorData = Red3Default;

	let matchNumber = 999;
	let matchStatus = MatchStateType.WaitingForPrestart;

	let detailView = () => {};

	const signalrConnection = connectFieldMonitor($settingsStore.fmsUrl);
	signalrConnection.onFieldMonitorDataChanged((data) => {
		for (const team of data) {
			if (!team) continue;

			if (team.alliance == AllianceType.Red) {
				if (team.station == StationType.Station1) {
					red1 = team;
				} else if (team.station == StationType.Station2) {
					red2 = team;
				} else if (team.station == StationType.Station3) {
					red3 = team;
				}
			} else if (team.alliance == AllianceType.Blue) {
				if (team.station == StationType.Station1) {
					blue1 = team;
				} else if (team.station == StationType.Station2) {
					blue2 = team;
				} else if (team.station == StationType.Station3) {
					blue3 = team;
				}
			}
		}
	});
	signalrConnection.onMatchStatusInfoChanged((data) => {
		matchNumber = data.matchNumber ?? 999;
		matchStatus = data.matchState ?? MatchStateType.NoCurrentlyActiveEvent;
	});

	function matchStatusToString(status: MatchStateType): string {
		switch (status) {
			case MatchStateType.WaitingForPrestart:
			case MatchStateType.WaitingForPrestartTO:
				return 'Ready to Pre-Start';
			case MatchStateType.Prestarting:
			case MatchStateType.PrestartingTO:
				return 'Prestarting';
			case MatchStateType.WaitingForMatchPreview:
			case MatchStateType.WaitingForMatchPreviewTO:
				return 'Waiting for Match Preview';
			case MatchStateType.WaitingForSetAudience:
			case MatchStateType.WaitingForSetAudienceTO:
				return 'Waiting for Set Audience';
			case MatchStateType.WaitingForMatchReady:
				return 'Match Not Ready';
			case MatchStateType.WaitingForMatchStart:
				return 'Match Ready';
			case MatchStateType.GameSpecificData:
				return 'Game Specific Data';
			case MatchStateType.MatchAuto:
				return 'Auto';
			case MatchStateType.MatchTransition:
				return 'Transition';
			case MatchStateType.MatchTeleop:
				return 'Teleop';
			case MatchStateType.MatchCancelled:
				return 'Aborted';
			case MatchStateType.WaitingForCommit:
				return 'Waiting for Commit';
			case MatchStateType.WaitingForPostResults:
				return 'Waiting for Post Results';
			case MatchStateType.NoCurrentlyActiveEvent:
			case MatchStateType.NoCurrentlyActiveTournamentLevel:
			case MatchStateType.TournamentLevelComplete:
				return 'Tournament Level Complete';
			default:
				return 'Unknown';
		}
	}
</script>

{#await signalrConnection.start()}
	<div class="text-center">Connecting to FMS...</div>
{:then}
	<div
		class="grid grid-cols-fieldmonitor lg:grid-cols-fieldmonitor-large gap-0.5 md:gap-1 mx-auto justify-center"
	>
		<div class="col-span-6 lg:col-span-8 flex text-lg md:text-2xl font-semibold">
			<div class="bg-neutral-700 px-2">M: {matchNumber}</div>
			<div class="flex-1 bg-green-600 px-2 text-center">{matchStatusToString(matchStatus)}</div>
			<div class="bg-neutral-700 px-2">On Time</div>
		</div>
		<MonitorRow monitorFrame={blue1} {detailView} />
		<MonitorRow monitorFrame={blue2} {detailView} />
		<MonitorRow monitorFrame={blue3} {detailView} />
		<MonitorRow monitorFrame={red1} {detailView} />
		<MonitorRow monitorFrame={red2} {detailView} />
		<MonitorRow monitorFrame={red3} {detailView} />
	</div>
{:catch error}
	<div class="text-center text-red-500">Error connecting to FMS: {error.message}</div>
{/await}
