import type { BatteryWidgetSettings } from './battery/settings';
import type { RioWidgetSettings } from './rio/settings';

export enum WidgetID {
	Battery = 'Battery',
	Rio = 'Rio'
}

export type WidgetDescription =
	| { id: WidgetID.Battery; settings: BatteryWidgetSettings }
	| { id: WidgetID.Rio; settings: RioWidgetSettings };

export interface FieldMonitorConfig {
	widgets: WidgetDescription[];
}

export const field_monitor_config: FieldMonitorConfig = {
	widgets: [
		{ id: WidgetID.Battery, settings: { showGraph: false } },
		{ id: WidgetID.Rio, settings: {} }
	]
};
