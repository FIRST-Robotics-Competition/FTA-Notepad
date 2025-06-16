import { EventNoteIssueTypes, EventNoteResolutionTypes } from './api-client/fms-client';

/**
 * Shared utilities for formatting enum values to display strings
 */

// Issue type formatting
export function formatIssueType(issueType: string | undefined): string {
	if (!issueType) return 'Unknown';

	switch (issueType) {
		case EventNoteIssueTypes.RoboRioIssue:
			return 'RoboRIO Issue';
		case EventNoteIssueTypes.DSIssue:
			return 'Driver Station Issue';
		case EventNoteIssueTypes.NoRobot:
			return 'No Robot';
		case EventNoteIssueTypes.RadioIssue:
			return 'Radio Issue';
		case EventNoteIssueTypes.RobotPwrIssue:
			return 'Robot Power Issue';
		case EventNoteIssueTypes.OtherRobotIssue:
			return 'Other Robot Issue';
		case EventNoteIssueTypes.VenueIssue:
			return 'Venue Issue';
		case EventNoteIssueTypes.ElectricalIssue:
			return 'Electrical Issue';
		case EventNoteIssueTypes.MechanicalIssue:
			return 'Mechanical Issue';
		case EventNoteIssueTypes.VolunteerIssue:
			return 'Volunteer Issue';
		case EventNoteIssueTypes.Other:
			return 'Other';
		default:
			return issueType;
	}
}

// Resolution status formatting
export function formatResolutionStatus(status: string | undefined): string {
	if (!status) return 'Unknown';

	switch (status) {
		case EventNoteResolutionTypes.Open:
			return 'Open';
		case EventNoteResolutionTypes.Resolved:
			return 'Resolved';
		case EventNoteResolutionTypes.NotApplicable:
			return 'Not Applicable';
		default:
			return status;
	}
}

// Status color classes for UI components
export function getStatusColor(status: string | undefined): string {
	switch (status) {
		case EventNoteResolutionTypes.Open:
			return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
		case EventNoteResolutionTypes.Resolved:
			return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
		case EventNoteResolutionTypes.NotApplicable:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
	}
}

// Issue type options for form dropdowns
export const issueTypeOptions = Object.values(EventNoteIssueTypes).map((val) => ({
	value: val,
	label: formatIssueType(val)
}));

// Resolution status options for form dropdowns
export const resolutionStatusOptions = Object.values(EventNoteResolutionTypes).map((val) => ({
	value: val,
	label: formatResolutionStatus(val)
}));

// Utility function to format timestamps consistently
export function formatTimestamp(timestamp: string | null | undefined): string {
	if (!timestamp) return '';
	try {
		const date = new Date(timestamp);
		return date.toLocaleString();
	} catch {
		return timestamp;
	}
}
