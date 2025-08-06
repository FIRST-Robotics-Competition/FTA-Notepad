import type { BatteryWidgetSettings } from './battery/settings';
import type { RioWidgetSettings } from './rio/settings';

export enum WidgetID {
    Battery = "Battery",
    Rio = "Rio",
}

type WidgetDescription =
	| { id: WidgetID.Battery; settings: BatteryWidgetSettings }
	| { id: WidgetID.Rio; settings: RioWidgetSettings };

type WidgetConfig = WidgetDescription[];

export const widget_config: WidgetConfig = [
    { id: WidgetID.Battery, settings: { showGraph: false } },
    { id: WidgetID.Rio, settings: {} },
];
