import { sessionstore } from '$lib/sessionstore';

export const organizationStore = sessionstore<string>('organization');
