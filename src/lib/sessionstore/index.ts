import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type SessionVariable = string | undefined;

// sessionStorage wraps a Svelte store and persists the value in session storage.
// The initial value comes from session storage.
export function sessionstore(key: string) {
	let value: SessionVariable;

	if (browser) {
		value = window.sessionStorage.getItem(key) || undefined;
	}

	const store = writable(value);

	function mySet(new_value: SessionVariable) {
		if (browser) {
			if (new_value === undefined) {
				window.sessionStorage.removeItem(key);
			} else {
				window.sessionStorage.setItem(key, new_value);
			}
		}

		store.set(new_value || '');
	}

	function myUpdate(fn: (s: SessionVariable) => SessionVariable) {
		mySet(fn(value));
	}

	return {
		subscribe: store.subscribe,
		set: mySet,
		update: myUpdate
	};
}
