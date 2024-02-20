<script>
	import { onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	import { token, removeCredentials } from '$lib/credentials.js';
	import { client } from '$lib/client.js';

	import Modal from '$lib/Modal.svelte';
	import ModalHeader from '$lib/ModalHeader.svelte';
	import Button from '$lib/Button.svelte';
	import Ribbon from '$lib/Ribbon.svelte';

	export let active;

	export let controlPlane;

	// When we get a token
	let accessToken;

	const dispatch = createEventDispatcher();

	async function initialize(t) {
		if (t == null) {
			return;
		}

		accessToken = t;
	}

	const tokenUnsubscribe = token.subscribe(initialize);

	onDestroy(tokenUnsubscribe);

	function close() {
		active = false;
	}

	async function submit() {
		try {
			await client(accessToken).apiV1ControlplanesControlPlaneNameDelete({
				controlPlaneName: controlPlane.name
			});
		} catch (error) {
			console.log(error);

			if (error.response.status == 401) {
				removeCredentials();
			}

			// TODO: error handling and reporting.
			//errors.add(message);

			return;
		}

		dispatch('deleted', {});
		active = false;
	}
</script>

<Modal {active} fixed="true">
	<ModalHeader text="Delete Control Plane" icon="mdi:delete" />
	<section>
		<b>
			This will irreversibly delete the control plane <em>{controlPlane.name}</em> and all clusters provisioned
			with it. Are you sure?
		</b>
		<Ribbon>
			<Button text="Delete" icon="mdi:delete" on:message={submit} />
			<Button text="Cancel" icon="mdi:tick" on:message={close} />
		</Ribbon>
	</section>
</Modal>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: var(--padding);
		padding: var(--padding);
	}
</style>
