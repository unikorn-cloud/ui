import { localStorage } from '$lib/localStorage';

// menu is the main menu definition.
export const menu = [
	{
		id: 'kubernetes-applications',
		value: 'Applications',
		icon: 'mdi:application-outline'
	},
	{
		id: 'kubernetes-clusters',
		value: 'Clusters',
		icon: 'mdi:kubernetes'
	},
	{
		id: 'kubernetes-control-planes',
		value: 'Control Planes',
		icon: 'mdi:controller'
	},
	{
		id: 'documentation',
		value: 'Documentation',
		icon: 'mdi:book-open-blank-variant',
		link: 'https://docs.unikorn-cloud.org'
	}
];

// defaultID selects the default/first-time view.
const defaultID = 'kubernetes-clusters';

// selected allows components to subscribe to menu selection updates.
export const selected = localStorage('navigation', defaultID);
