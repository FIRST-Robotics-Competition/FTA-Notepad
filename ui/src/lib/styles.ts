import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names with proper Tailwind handling
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Shared styles for commonly repeated UI patterns across the app.
 * Only includes styles that are genuinely reused across multiple components.
 */
export const styles = {
	// Form inputs - repeated 5+ times in AddNoteModal
	input: {
		base: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
	},

	// Badges - used in multiple components (MatchCard, TeamCard, note displays)
	badge: {
		base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
		blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
		orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
		purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
	},

	// Section headers - used 4 times in notes page
	sectionHeader: {
		button: "flex items-center justify-between w-full text-left mb-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
	},

	// Empty states - used 4 times in notes page
	emptyState: {
		container: "text-center py-6 bg-gray-50 rounded-lg dark:bg-gray-800"
	},

	// Error states - used in multiple places
	error: {
		container: "rounded-md bg-red-50 p-4 dark:bg-red-900/20",
		message: "p-3 bg-red-100 border border-red-400 text-red-700 rounded-md",
		button: "rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 dark:bg-red-900/20 dark:text-red-200 dark:hover:bg-red-900/40"
	}
};
