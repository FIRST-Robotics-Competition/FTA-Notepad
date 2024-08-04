import * as signalR from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import type { components } from './fms-api';

const fieldMonitorHubPostfix = 'fieldMonitorHub';

export function connectFieldMonitor(
	fmsUrl: `http://${string}`
): signalR.HubConnection & FieldMonitorHub {
	const connection = new signalR.HubConnectionBuilder()
		.withUrl(`${fmsUrl}/${fieldMonitorHubPostfix}`)
		.withHubProtocol(new MessagePackHubProtocol())
		.build();

	return Object.assign(connection, {
		onMatchStatusInfoChanged: function (listener: (matchStatusInfo: MatchStatusInfo) => void) {
			connection.on('MatchStatusInfoChanged', (data) => {
				listener(transformMapping(MatchStatusInfoMapping, data));
			});
			return connection;
		},
		onFieldMonitorDataChanged: function (listener: (fieldMonitorData: FieldMonitorData) => void) {
			connection.on('FieldMonitorDataChanged', (data) => {
				listener(transformMapping(FieldMonitorDataMapping, data));
			});
			return connection;
		}
	});
}

function transformMapping<T>(mapping: { [key: string]: string }, data: any): T {
	const result: any = {};
	for (const [oldKey, value] of Object.entries(data)) {
		const newKey = mapping[oldKey] || oldKey; // Use the new key if it exists, otherwise keep the old key
		result[newKey] = value;
	}
	return result as T;
}

export interface FieldMonitorHub {
	onMatchStatusInfoChanged(listener: (matchStatusInfo: MatchStatusInfo) => void): void;
	onFieldMonitorDataChanged(listener: (fieldMonitorData: FieldMonitorData) => void): void;
}

export type MatchStatusInfo = components['schemas']['MatchStatusInfo'];

const MatchStatusInfoMapping = {
	p1: 'matchState',
	p2: 'matchNumber',
	p3: 'playNumber',
	p4: 'level'
};

export type FieldMonitorData = components['schemas']['FieldMonitorData'];

const FieldMonitorDataMapping = {
	p1: 'alliance',
	p2: 'station',
	p3: 'teamNumber',
	p4: 'connection',
	p5: 'linkActive',
	p6: 'dsLinkActive',
	p7: 'radioLink',
	p8: 'rioLink',
	p9: 'isEnabled',
	pa: 'isAuto',
	pb: 'isBypassed',
	pc: 'isEStopPressed',
	pd: 'isEStopped',
	pe: 'battery',
	pf: 'monitorStatus',
	pg: 'averageTripTime',
	ph: 'lostPackets',
	pi: 'signal',
	pj: 'noise',
	pk: 'snr',
	pl: 'inactivity',
	pm: 'macAddress',
	pn: 'txRate',
	po: 'txMCS',
	pp: 'txMCSBandWidth',
	pq: 'txVHT',
	pr: 'txVHTNSS',
	ps: 'txPackets',
	pt: 'rxRate',
	pu: 'rxMCS',
	pv: 'rxMCSBandWidth',
	pw: 'rxVHT',
	px: 'rxVHTNSS',
	py: 'rxPackets',
	pz: 'dataRateTotal',
	paa: 'dataRateToRobot',
	pbb: 'dataRateFromRobot',
	pcc: 'bwUtilization',
	pdd: 'wpaKeyStatus',
	pee: 'driverStationIsOfficial',
	pff: 'stationStatus',
	pgg: 'brownout',
	phh: 'eStopSource',
	pii: 'isAStopPressed',
	pjj: 'isAStopped',
	pjk: 'moveToStation'
};

export enum AllianceType {
    None = 0,
    Red = 1,
    Blue = 2
}

export enum StationType {
    None = 0,
    Station1 = 1,
    Station2 = 2,
    Station3 = 3
}

export enum BWUtilizationType {
    Low = 0,
    Medium = 1,
    High = 2,
    VeryHigh = 3
}

export enum MonitorStatusType {
    Unknown = 0,
    EStopped = 1,
    AStopped = 2,
    DisabledAuto = 3,
    DisabledTeleop = 4,
    EnabledAuto = 5,
    EnabledTeleop = 6
}

export enum DSStationStatus {
    Good = 0,
    MoveStation = 1,
    Waiting = 2,
    Unknown = 3
}

const ftaAppHubPostfix = 'ftaAppHub';

export function connectFTAApp(fmsUrl: `http://${string}`): signalR.HubConnection & FTAAppHub {
	const connection = new signalR.HubConnectionBuilder()
		.withUrl(`${fmsUrl}/${ftaAppHubPostfix}`)
		.withHubProtocol(new MessagePackHubProtocol())
		.build();

	return Object.assign(connection, {
		onNoteChanged: function (listener: (noteChanged: NoteChangedEvent) => void) {
			connection.on('NoteChanged', (data) => {
				listener(transformMapping(NoteChangedEventMapping, data));
			});
		},
		onMatchStatusInfoChanged: function (listener: (matchStatusInfo: MatchStatusInfo) => void) {
			connection.on('MatchStatusInfoChanged', (data) => {
				listener(transformMapping(MatchStatusInfoMapping, data));
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

const NoteChangedEventMapping = {
	p1: 'noteType',
	p2: 'fmsNoteId',
	p3: 'recordVersion',
	p4: 'type',
	p5: 'fmsDeviceIdentification',
	p6: 'currentTimeStamp',
	p7: 'previousTimeStamp'
};
