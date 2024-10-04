import * as signalR from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { AllianceType, BWUtilizationType, DSStationStatus, EventNoteChangeTypes, EventNoteTypes, MatchStateType, MonitorStatusType, StationType, TournamentLevel, WPAKeyStatusType, type components } from './fms-api';

const fieldMonitorHubPostfix = 'fieldMonitorHub';

export function connectFieldMonitor(fmsUrl: string): signalR.HubConnection & FieldMonitorHub {
	const connection = new signalR.HubConnectionBuilder()
		.withUrl(`${fmsUrl}/${fieldMonitorHubPostfix}`)
		.withHubProtocol(new MessagePackHubProtocol())
		.build();

	return Object.assign(connection, {
		onMatchStatusInfoChanged: function (listener: (matchStatusInfo: MatchStatusInfo) => void) {
			connection.on('MatchStatusInfoChanged', (data: MessagePackMatchStatusInfo) => {
				listener(mapMessagePackMatchState(data));
			});
			return connection;
		},
		onFieldMonitorDataChanged: function (listener: (fieldMonitorData: FieldMonitorData[]) => void) {
			connection.on('FieldMonitorDataChanged', (data: MessagePackFieldMonitorData[]) => {
				listener(data.map((d) => mapMessagePackFieldMonitorData(d)));
			});
			return connection;
		}
	});
}

export interface FieldMonitorHub {
	onMatchStatusInfoChanged(listener: (matchStatusInfo: MatchStatusInfo) => void): void;
	onFieldMonitorDataChanged(listener: (fieldMonitorData: FieldMonitorData[]) => void): void;
}

export type MatchStatusInfo = components['schemas']['MatchStatusInfo'];

enum MessagePackMatchState {
	NoCurrentlyActiveEvent = 0,
	NoCurrentlyActiveTournamentLevel = 1,
	WaitingForPrestart = 2,
	WaitingForPrestartTO = 3,
	Prestarting = 4,
	PrestartingTO = 5,
	WaitingForSetAudience = 6,
	WaitingForSetAudienceTO = 7,
	WaitingForMatchReady = 8,
	WaitingForMatchStart = 9,
	GameSpecificData = 10,
	MatchAuto = 11,
	MatchTransition = 12,
	MatchTeleop = 13,
	WaitingForCommit = 14,
	WaitingForPostResults = 15,
	TournamentLevelComplete = 16,
	MatchCancelled = 17,
	WaitingForMatchPreview = 18,
	WaitingForMatchPreviewTO = 19,
}

enum MessagePackLevel {
	Match_Test = 0,
	Practice = 1,
	Qualification = 2,
	Playoff = 3,
}

type MessagePackMatchStatusInfo = {
	p1: MessagePackMatchState;
	p2: number;
	p3: number;
	p4: MessagePackLevel;
}

function mapMessagePackMatchState(messagePackMatchState: MessagePackMatchStatusInfo): MatchStatusInfo {
	let matchState: MatchStateType = MatchStateType.NoCurrentlyActiveEvent;
	switch (messagePackMatchState.p1) {
		case MessagePackMatchState.NoCurrentlyActiveEvent:
			matchState = MatchStateType.NoCurrentlyActiveEvent;
			break;
		case MessagePackMatchState.NoCurrentlyActiveTournamentLevel:
			matchState = MatchStateType.NoCurrentlyActiveTournamentLevel;
			break;
		case MessagePackMatchState.WaitingForPrestart:
			matchState = MatchStateType.WaitingForPrestart;
			break;
		case MessagePackMatchState.WaitingForPrestartTO:
			matchState = MatchStateType.WaitingForPrestartTO;
			break;
		case MessagePackMatchState.Prestarting:
			matchState = MatchStateType.Prestarting;
			break;
		case MessagePackMatchState.PrestartingTO:
			matchState = MatchStateType.PrestartingTO;
			break;
		case MessagePackMatchState.WaitingForSetAudience:
			matchState = MatchStateType.WaitingForSetAudience
			break;
		case MessagePackMatchState.WaitingForSetAudienceTO:
			matchState = MatchStateType.WaitingForSetAudienceTO
			break;
		case MessagePackMatchState.WaitingForMatchReady:
			matchState = MatchStateType.WaitingForMatchReady
			break;
		case MessagePackMatchState.WaitingForMatchStart:
			matchState = MatchStateType.WaitingForMatchStart;
			break;
		case MessagePackMatchState.GameSpecificData:
			matchState = MatchStateType.GameSpecificData;
			break;
		case MessagePackMatchState.MatchAuto:
			matchState = MatchStateType.MatchAuto
			break;
		case MessagePackMatchState.MatchTransition:
			matchState = MatchStateType.MatchTransition;
			break;
		case MessagePackMatchState.MatchTeleop:
			matchState = MatchStateType.MatchTeleop
			break;
		case MessagePackMatchState.WaitingForCommit:
			matchState = MatchStateType.WaitingForCommit;
			break;
		case MessagePackMatchState.WaitingForPostResults:
			matchState = MatchStateType.WaitingForPostResults
			break;
		case MessagePackMatchState.TournamentLevelComplete:
			matchState = MatchStateType.TournamentLevelComplete
			break;
		case MessagePackMatchState.MatchCancelled:
			matchState = MatchStateType.MatchCancelled
			break;
		case MessagePackMatchState.WaitingForMatchPreview:
			matchState = MatchStateType.WaitingForMatchPreview
			break;
		case MessagePackMatchState.WaitingForMatchPreviewTO:
			matchState = MatchStateType.WaitingForMatchPreviewTO
			break;
	}

	let tournamentLevel: TournamentLevel = TournamentLevel.Match_Test;

	switch (messagePackMatchState.p4) {
		case MessagePackLevel.Match_Test:
			tournamentLevel = TournamentLevel.Match_Test;
			break;
		case MessagePackLevel.Practice:
			tournamentLevel = TournamentLevel.Practice;
			break;
		case MessagePackLevel.Qualification:
			tournamentLevel = TournamentLevel.Qualification;
			break;
		case MessagePackLevel.Playoff:
			tournamentLevel = TournamentLevel.Playoff;
			break;
	}

	return {
		matchState: matchState,
		matchNumber: messagePackMatchState.p2,
		playNumber: messagePackMatchState.p3,
		level: tournamentLevel
	}
}

export type FieldMonitorData = components['schemas']['FieldMonitorData'];

enum MessagePackAlliance {
	None = 0,
	Red = 1,
	Blue = 2,
}

enum MessagePackStation {
	None = 0,
	Station1 = 1,
	Station2 = 2,
	Station3 = 3,
}

enum MessagePackMonitorStatus {
	Unknown = 0,
	EStopped = 1,
	AStopped = 2,
	DisabledAuto = 3,
	DisabledTeleop = 4,
	EnabledAuto = 5,
	EnabledTeleop = 6,
}

enum MessagePackBWUtilization {
	Low = 0,
	Medium = 1,
	High = 2,
	VeryHigh = 3,
}

enum MessagePackWPAKeyStatus {
	NotTested = 0,
	UsedInConnectionTest = 1,
	UsedInMatch = 2,
}

enum MessagePackStationStatus {
	Good = 0,
	MoveStation = 1,
	Waiting = 2,
	Unknown = 3,
}

type MessagePackFieldMonitorData = {
	p1: MessagePackAlliance;
	p2: MessagePackStation;
	p3: number;
	p4: boolean;
	p5: boolean;
	p6: boolean;
	p7: boolean;
	p8: boolean;
	p9: boolean;
	pa: boolean;
	pb: boolean;
	pc: boolean;
	pd: boolean;
	pe: number;
	pf: MessagePackMonitorStatus;
	pg: number;
	ph: number;
	pi?: number;
	pj?: number;
	pk: number;
	pl: number;
	pm: string;
	pn?: number;
	po?: number;
	pp?: number;
	pq?: boolean;
	pr?: number;
	ps: number;
	pt?: number;
	pu?: number;
	pv?: number;
	pw?: boolean;
	px?: number;
	py: number;
	pz: number;
	paa: number;
	pbb: number;
	pcc: MessagePackBWUtilization;
	pdd: MessagePackWPAKeyStatus;
	pee: boolean;
	pff: MessagePackStationStatus;
	pgg: boolean;
	phh: string;
	pii: boolean;
	pjj: boolean;
	pjk: string;
}

function mapMessagePackFieldMonitorData(messagePackMatchState: MessagePackFieldMonitorData): FieldMonitorData {
	let alliance: AllianceType = AllianceType.None;
	switch (messagePackMatchState.p1) {
		case MessagePackAlliance.None:
			alliance = AllianceType.None;
			break;
		case MessagePackAlliance.Red:
			alliance = AllianceType.Red;
			break;
		case MessagePackAlliance.Blue:
			alliance = AllianceType.Blue;
			break;
	}

	let station: StationType = StationType.None;
	switch (messagePackMatchState.p2) {
		case MessagePackStation.None:
			station = StationType.None;
			break;
		case MessagePackStation.Station1:
			station = StationType.Station1;
			break;
		case MessagePackStation.Station2:
			station = StationType.Station2;
			break;
		case MessagePackStation.Station3:
			station = StationType.Station3;
			break;
	}

	let monitorStatus: MonitorStatusType = MonitorStatusType.Unknown;
	switch (messagePackMatchState.pf) {
		case MessagePackMonitorStatus.Unknown:
			monitorStatus = MonitorStatusType.Unknown;
			break;
		case MessagePackMonitorStatus.EStopped:
			monitorStatus = MonitorStatusType.EStopped;
			break;
		case MessagePackMonitorStatus.AStopped:
			monitorStatus = MonitorStatusType.AStopped;
			break;
		case MessagePackMonitorStatus.DisabledAuto:
			monitorStatus = MonitorStatusType.DisabledAuto;
			break;
		case MessagePackMonitorStatus.DisabledTeleop:
			monitorStatus = MonitorStatusType.DisabledTeleop;
			break;
		case MessagePackMonitorStatus.EnabledAuto:
			monitorStatus = MonitorStatusType.EnabledAuto;
			break;
		case MessagePackMonitorStatus.EnabledTeleop:
			monitorStatus = MonitorStatusType.EnabledTeleop;
			break;
	}

	let bwUtilization: BWUtilizationType = BWUtilizationType.Low;
	switch (messagePackMatchState.pcc) {
		case MessagePackBWUtilization.Low:
			bwUtilization = BWUtilizationType.Low;
			break;
		case MessagePackBWUtilization.Medium:
			bwUtilization = BWUtilizationType.Medium;
			break;
		case MessagePackBWUtilization.High:
			bwUtilization = BWUtilizationType.High;
			break;
		case MessagePackBWUtilization.VeryHigh:
			bwUtilization = BWUtilizationType.VeryHigh;
			break;
	}

	let wpaKeyStatus: WPAKeyStatusType = WPAKeyStatusType.NotTested;
	switch (messagePackMatchState.pdd) {
		case MessagePackWPAKeyStatus.NotTested:
			wpaKeyStatus = WPAKeyStatusType.NotTested;
			break;
		case MessagePackWPAKeyStatus.UsedInConnectionTest:
			wpaKeyStatus = WPAKeyStatusType.UsedInConnectionTest;
			break;
		case MessagePackWPAKeyStatus.UsedInMatch:
			wpaKeyStatus = WPAKeyStatusType.UsedInMatch;
			break;
	}

	let stationStatus: DSStationStatus = DSStationStatus.Unknown;
	switch (messagePackMatchState.pff) {
		case MessagePackStationStatus.Good:
			stationStatus = DSStationStatus.Good;
			break;
		case MessagePackStationStatus.MoveStation:
			stationStatus = DSStationStatus.MoveStation;
			break;
		case MessagePackStationStatus.Waiting:
			stationStatus = DSStationStatus.Waiting;
			break;
		case MessagePackStationStatus.Unknown:
			stationStatus = DSStationStatus.Unknown;
			break;
	}

	return {
		alliance: alliance,
		station: station,
		teamNumber: messagePackMatchState.p3,
		connection: messagePackMatchState.p4,
		linkActive: messagePackMatchState.p5,
		dsLinkActive: messagePackMatchState.p6,
		radioLink: messagePackMatchState.p7,
		rioLink: messagePackMatchState.p8,
		isEnabled: messagePackMatchState.p9,
		isAuto: messagePackMatchState.pa,
		isBypassed: messagePackMatchState.pb,
		isEStopPressed: messagePackMatchState.pc,
		isEStopped: messagePackMatchState.pd,
		battery: messagePackMatchState.pe,
		monitorStatus: monitorStatus,
		averageTripTime: messagePackMatchState.pg,
		lostPackets: messagePackMatchState.ph,
		signal: messagePackMatchState.pi,
		noise: messagePackMatchState.pj,
		snr: messagePackMatchState.pk,
		inactivity: messagePackMatchState.pl,
		macAddress: messagePackMatchState.pm,
		txRate: messagePackMatchState.pn,
		txMCS: messagePackMatchState.po,
		txMCSBandWidth: messagePackMatchState.pp,
		txVHT: messagePackMatchState.pq,
		txVHTNSS: messagePackMatchState.pr,
		txPackets: messagePackMatchState.ps,
		rxRate: messagePackMatchState.pt,
		rxMCS: messagePackMatchState.pu,
		rxMCSBandWidth: messagePackMatchState.pv,
		rxVHT: messagePackMatchState.pw,
		rxVHTNSS: messagePackMatchState.px,
		rxPackets: messagePackMatchState.py,
		dataRateTotal: messagePackMatchState.pz,
		dataRateToRobot: messagePackMatchState.paa,
		dataRateFromRobot: messagePackMatchState.pbb,
		bwUtilization: bwUtilization,
		wpaKeyStatus: wpaKeyStatus,
		driverStationIsOfficial: messagePackMatchState.pee,
		stationStatus: stationStatus,
		brownout: messagePackMatchState.pgg,
		eStopSource: messagePackMatchState.phh,
		isAStopPressed: messagePackMatchState.pii,
		isAStopped: messagePackMatchState.pjj,
		moveToStation: messagePackMatchState.pjk,
	}
}

const ftaAppHubPostfix = 'ftaAppHub';

export function connectFTAApp(fmsUrl: `http://${string}`): signalR.HubConnection & FTAAppHub {
	const connection = new signalR.HubConnectionBuilder()
		.withUrl(`${fmsUrl}/${ftaAppHubPostfix}`)
		.withHubProtocol(new MessagePackHubProtocol())
		.build();

	return Object.assign(connection, {
		onNoteChanged: function (listener: (noteChanged: NoteChangedEvent) => void) {
			connection.on('NoteChanged', (data: MessagePackNoteChangedEvent) => {
				listener(mapMessagePackNoteChangedEvent(data));
			});
		},
		onMatchStatusInfoChanged: function (listener: (matchStatusInfo: MatchStatusInfo) => void) {
			connection.on('MatchStatusInfoChanged', (data: MessagePackMatchStatusInfo) => {
				listener(mapMessagePackMatchState(data));
			});
			return connection;
		}
	});
}

export interface FTAAppHub {
	onNoteChanged(listener: (noteChanged: NoteChangedEvent) => void): void;
	onMatchStatusInfoChanged(listener: (matchStatusInfo: MatchStatusInfo) => void): void;
}

export type NoteChangedEvent = components['schemas']['EventNoteChange'];

enum MessagePackNoteType {
	FTAEvent = 1,
	FTAMatch = 2,
	FTATeamIssue = 3,
	FTAAppUsageData = 4,
	FTATeam = 5,
	FMSAllianceTimeout = 10,
	FMSMatchMaker = 11,
	Staff = 15,
}

enum MessagePackNoteChangeType {
	Create = 1,
	Update = 2,
	Delete = 3,
}

type MessagePackNoteChangedEvent = {
	p1: MessagePackNoteType;
	p2: string;
	p3?: number;
	p4: MessagePackNoteChangeType;
	p5: string;
	p6: string;
	p7?: string;
}

function mapMessagePackNoteChangedEvent(noteChangedEvent: MessagePackNoteChangedEvent): NoteChangedEvent {
	let noteType: EventNoteTypes = EventNoteTypes.FTATeamIssue;
	switch (noteChangedEvent.p1) {
		case MessagePackNoteType.FTAEvent:
			noteType = EventNoteTypes.FTAEvent;
			break;
		case MessagePackNoteType.FTAMatch:
			noteType = EventNoteTypes.FTAMatch
			break;
		case MessagePackNoteType.FTATeamIssue:
			noteType = EventNoteTypes.FTATeamIssue;
			break;
		case MessagePackNoteType.FTAAppUsageData:
			noteType = EventNoteTypes.FTAAppUsageData;
			break;
		case MessagePackNoteType.FTATeam:
			noteType = EventNoteTypes.FTATeam;
			break;
		case MessagePackNoteType.FMSAllianceTimeout:
			noteType = EventNoteTypes.FMSAllianceTimeout;
			break;
		case MessagePackNoteType.FMSMatchMaker:
			noteType = EventNoteTypes.FMSMatchMaker;
			break;
		case MessagePackNoteType.Staff:
			noteType = EventNoteTypes.Staff;
			break;
	}

	let type: EventNoteChangeTypes = EventNoteChangeTypes.Create;
	switch (noteChangedEvent.p4) {
		case MessagePackNoteChangeType.Create:
			type = EventNoteChangeTypes.Create;
			break;
		case MessagePackNoteChangeType.Update:
			type = EventNoteChangeTypes.Update;
			break;
		case MessagePackNoteChangeType.Delete:
			type = EventNoteChangeTypes.Delete;
			break;
	}

	return {
		noteType: noteType,
		fmsNoteId: noteChangedEvent.p2,
		recordVersion: noteChangedEvent.p3,
		type: type,
		fmsDeviceIdentification: noteChangedEvent.p5,
		currentTimeStamp: noteChangedEvent.p6,
		previousTimeStamp: noteChangedEvent.p7,
	}
}
