<script>
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';

	import Base64url from 'crypto-js/enc-base64url';
	import SHA256 from 'crypto-js/sha256';
	import MD5 from 'crypto-js/md5';

	import { token, email, removeCredentials } from '$lib/credentials.js';
	import { menu, selected } from '$lib/menu.js';
	import { listProjects } from '$lib/client.js';
	import { env } from '$env/dynamic/public';

	import Menu from '$lib/Menu.svelte';

	import ControlPlaneView from '$lib/ControlPlaneView.svelte';
	import ClusterView from '$lib/ClusterView.svelte';
	import ApplicationView from '$lib/ApplicationView.svelte';
	import Errors from '$lib/Errors.svelte';

	import Portal from 'svelte-portal';

	// Access token, this changing should trigger all the things.
	let accessToken;

	// User email address from OIDC.
	let emailAddress = '';

	// Only used in mobile view, default to closed.
	let shownav = false;

	// Content to display.
	let content;

	// Whether or not to behave as if it's a large desktop window.
	let desktop = true;

	if (browser) {
		desktop = window.matchMedia('(min-width: 720px)').matches;

		window.onresize = () => {
			desktop = window.matchMedia('(min-width: 720px)').matches;
		};
	}

	let projects = [];
	let currentProject = null;

	const emailUnsubscribe = email.subscribe(changeEmail);
	const tokenUnsubscribe = token.subscribe(changeToken);
	const selectedUnsubscribe = selected.subscribe(changeMenuItem);

	onDestroy(() => {
		tokenUnsubscribe();
		emailUnsubscribe();
		selectedUnsubscribe();
	});

	function toggleMenu() {
		shownav = !shownav;
	}

	// logout flushes the token.
	function logout() {
		removeCredentials();
	}

	function changeEmail(value) {
		emailAddress = value;
	}

	function changeToken(value) {
		if (value == null) {
			if (browser) {
				let codeChallengeVerifierBytes = new Uint8Array(32);

				crypto.getRandomValues(codeChallengeVerifierBytes);

				const codeChallengeVerifier = btoa(codeChallengeVerifierBytes);
				const codeChallenge = SHA256(codeChallengeVerifier).toString(Base64url);

				window.sessionStorage.setItem('oauth2_code_challenge_verifier', codeChallengeVerifier);

				// TODO: set a nonce
				const query = new URLSearchParams({
					response_type: 'code',
					client_id: env.PUBLIC_OAUTH2_CLIENT_ID,
					redirect_uri: `https://${window.location.host}/oauth2/callback`,
					code_challenge_method: 'S256',
					code_challenge: codeChallenge,
					scope: 'openid email profile'
				});

				const url = new URL(env.PUBLIC_OAUTH2_AUTHORIZATION_ENDPOINT);
				url.search = query.toString();

				document.location = url.toString();
			}
		}

		accessToken = value;
	}

	async function updateProjects(accessToken) {
		if (accessToken == null) {
			projects = [];
			currentProject = null;
			return;
		}

		const result = await listProjects({
			token: accessToken,
			onUnauthorized: () => {
				removeCredentials();
			}
		});

		if (result == null) {
			return;
		}

		projects = result;

		/*
		// projectID *should* be set before the access token changes.
		currentProject = projects.filter((p) => p.id == projectID)[0];
		*/
	}

	$: updateProjects(accessToken);

	// When the project changes, rescope the token.
	/*
	async function changeProject() {
		await updateCredentials(accessToken, currentProject.id);
	}
	*/

	function changeMenuItem(value) {
		// Hide the menu on mobile view, it's covering everything.
		if (!desktop) {
			shownav = false;
		}

		content = value;
	}
</script>

<Portal target="#modal" />
<div id="modal" />

{#if desktop}
	<nav id="nav-desktop">
		<section id="nav-header">
			<img
				src="img/logo.svg"
				alt="Unikorn Logo"
				onload="SVGInject(this)"
				style="max-height: 2.2em; width: auto"
			/>
		</section>

		<section>
			<div class="user">
				<img src="https://www.gravatar.com/avatar/{MD5(emailAddress)}" alt="User Gravatar" />
				<span>{emailAddress}</span>
				<iconify-icon
					class="selectable"
					icon="material-symbols:logout"
					on:click={logout}
					on:keypress={logout}
				/>
			</div>
		</section>

		<section>
			<Menu {menu} />
		</section>

		<div class="about">Version {env.PUBLIC_APPLICATION_VERSION}</div>
	</nav>
{:else}
	<header>
		<span id="hamburger" class="selectable" on:click={toggleMenu} on:keypress={toggleMenu}>
			<iconify-icon id="hamburger-icon" icon="material-symbols:menu" />
			<label for="hamburger-icon">menu</label>
		</span>

		<img
			src="img/logo.svg"
			alt="Unikorn Logo"
			onload="SVGInject(this)"
			style="max-height: 2.2em; width: auto"
		/>
	</header>

	<div id="nav-overlay" class:shownav />

	<div id="nav-container" class:shownav>
		<nav id="nav-mobile">
			<section id="nav-header">
				<img
					src="img/logo.svg"
					alt="Unikorn Logo"
					onload="SVGInject(this)"
					style="max-height: 2.2em; width: auto"
				/>
			</section>

			<section>
				<div class="user">
					<img src="https://www.gravatar.com/avatar/{MD5(emailAddress)}" alt="User Gravatar" />
					<span>{emailAddress}</span>
					<iconify-icon
						class="selectable"
						icon="material-symbols:logout"
						on:click={logout}
						on:keypress={logout}
					/>
				</div>
			</section>

			<section>
				<Menu {menu} />
			</section>

			<div class="about">Version {env.PUBLIC_APPLICATION_VERSION}</div>
		</nav>

		<span id="nav-closer" class="selectable" on:click={toggleMenu} on:keypress={toggleMenu}>
			<iconify-icon id="nav-close" icon="material-symbols:close" />
			<label for="nav-close">close</label>
		</span>
	</div>
{/if}

<main>
	<Errors />
	{#if content == 'kubernetes-control-planes'}
		<ControlPlaneView />
	{:else if content == 'kubernetes-clusters'}
		<ClusterView />
	{:else if content == 'kubernetes-applications'}
		<ApplicationView />
	{/if}
</main>

<style>
	/* Global constants */
	:global(:root) {
		/* Brand color palette */
		--brand: rgb(73, 118, 132);
		--brand-light: rgb(101, 162, 181);
		--brand-dark: rgb(50, 80, 90);
		--input: var(--brand);
		--input-selected: var(--brand-dark);
		--border: rgb(170, 170, 170);

		/* Generic colors */
		--light-grey: rgb(200, 200, 200);
		--mid-grey: rgb(160, 160, 160);
		--dark-grey: rgb(96, 96, 96);
		--shadow: var(--mid-grey);
		--error: deeppink;

		/* Various stylings to keep consistency */
		--radius: 0.5rem;
		--padding-small: 0.5rem;
		--padding: 0.75rem;
		--padding-large: 1.5rem;
		--icon-size: 1.25rem;

		--overlay: rgba(255, 255, 255, 0.8);
		--overlay-highlight: rgba(230, 240, 245, 0.8);
		--background: rgb(231, 238, 240);
	}

	/* Global styles */
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	:global(html) {
		font-family: sans-serif;
	}
	:global(body) {
		background-attachment: fixed;
		background-size: cover;
		background-image: url('/img/light.jpg');
	}
	:global(h1, h2, h3, h4, h5, h6) {
		color: var(--brand);
	}
	:global(h1) {
		font-size: 2rem;
	}
	:global(h2) {
		font-size: 1.7rem;
	}
	:global(h3) {
		font-size: 1.4rem;
	}
	:global(h4) {
		font-size: 1.2rem;
	}
	:global(h5) {
		font-size: 1rem;
	}
	:global(a:link, a:visited) {
		transition: all 0.2s ease-in;
		color: var(--input);
	}
	:global(a:hover) {
		color: var(--input-selected);
	}
	:global(input[type='text'], input[type='password'], input[type='range'], select) {
		box-sizing: border-box;
		background: none;
		border: none;
		width: 100%;
		font-size: 1rem;
		transition: all 0.2s ease-in;
		color: inherit;
	}
	:global(input[type='text'], input[type='password'], select) {
		padding: var(--padding-small);
		border-bottom: 2px solid var(--brand);
		text-overflow: ellipsis;
	}
	:global(
			input[type='text']:focus,
			input[type='password']:focus,
			input[type='range']:focus,
			select:focus
		) {
		outline: none;
		color: inherit;
	}
	:global(input[type='text']:invalid, input[type='password']:invalid, select:invalid) {
		box-shadow: 0 0 var(--radius) var(--error);
	}
	:global(input[type='range']::-moz-range-track) {
		background-color: var(--brand);
	}
	:global(input[type='range']::-webkit-slider-runnable-track) {
		background-color: var(--brand);
	}
	:global(input[type='checkbox']) {
		appearance: none;
		display: grid;
		place-content: center;
		width: 1.5em;
		height: 1.5em;
		border: 2px solid var(--brand);
	}
	:global(input[type='checkbox']:disabled) {
		border: 2px solid var(--mid-grey);
	}
	:global(input[type='checkbox']::before) {
		content: '';
		width: 0.75em;
		height: 0.75em;
		transform: scale(0);
		transition: all 0.2s ease-in;
		background-color: var(--brand);
	}
	:global(input[type='checkbox']:disabled::before) {
		background-color: var(--mid-grey);
	}
	:global(input[type='checkbox']:checked::before) {
		transform: scale(1);
	}
	:global(hr) {
		color: var(--border);
	}
	:global(dl) {
		display: flex;
		flex-direction: column;
		gap: var(--padding);
		font-size: 0.75rem;
	}
	:global(dt) {
		font-weight: bold;
	}

	/* Global styles */
	:global(.selectable) {
		cursor: pointer;
	}
	:global(.error) {
		color: var(--error);
	}
	:global(iconify-icon) {
		font-size: var(--icon-size);
	}

	/* Main styling */
	:global(.container) {
		width: 100vw;
		height: 100vh;
		display: flex;
		display: flex;
		flex-direction: column;
	}

	/* Header/masthead styling */
	header {
		position: sticky;
		top: 0;
		display: flex;
		gap: var(--padding);
		align-items: center;
		background-color: var(--overlay);
		backdrop-filter: blur(var(--radius));
		padding: var(--padding);
		z-index: 1;
	}

	#hamburger {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	#hamburger > iconify-icon {
		font-size: 1.5em;
	}
	#hamburger > label {
		font-size: 0.5em;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100vw;
	}

	/* Nav styling */
	#nav-overlay {
		position: fixed;
		width: 100vw;
		height: 100vh;
		display: none;
		opacity: 0;
		background-color: var(--overlay);
		backdrop-filter: blur(var(--radius));
		transition: all 0.2s ease-in-out;
		z-index: 10;
	}

	#nav-overlay.shownav {
		display: block;
		opacity: 1;
	}

	#nav-container {
		position: fixed;
		width: 100vw;
		transform: translateX(calc(-1 * 100vw));
		transition: all 0.2s ease-in;
		display: flex;
		z-index: 20;
	}

	#nav-container.shownav {
		transform: translateX(0);
	}

	nav {
		height: 100vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: var(--padding-large);
		padding: var(--padding);
		background-color: var(--brand-dark);
		box-shadow: 0 0 var(--radius) var(--shadow);
	}

	nav#nav-mobile {
		color: white;
		flex-grow: 1;
	}

	nav > section {
		display: flex;
		flex-direction: column;
		gap: var(--padding);
	}

	nav > section#nav-header {
		flex-direction: row;
		gap: var(--padding);
		align-items: center;
	}

	#nav-closer {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--padding);
	}

	#nav-closer > iconify-icon {
		font-size: 1.5em;
	}
	#nav-closer > label {
		font-size: 0.5em;
	}

	/* User nav element */
	.user {
		display: flex;
		align-items: center;
		gap: var(--padding);
	}
	.user span {
		font-size: 0.8em;
		flex-grow: 1;
	}
	.user img {
		max-height: 2em;
		border-radius: 1em;
		border: 1px solid currentColor;
	}
	.user iconify-icon {
		font-size: var(--icon-size);
		color: var(--brand);
	}

	.about {
		font-size: 0.8em;
		color: var(--mid-grey);
	}

	/* admonitions are main content elements that aren't interactive */
	:global(.admonition) {
		border-radius: var(--radius);
		background-color: var(--overlay);
		backdrop-filter: blur(var(--radius));
		box-shadow: 0 0 var(--radius) var(--shadow);
		border: 1px solid var(--border);
	}

	/* widgets are main content elements that are interactive and change on hover
	   to communicate this */
	:global(.widget) {
		transition: all 0.2s ease-in;
		border-radius: var(--radius);
		background-color: var(--overlay);
		backdrop-filter: blur(var(--radius));
		box-shadow: 0 0 var(--radius) var(--shadow);
		border: 1px solid var(--border);
	}

	:global(.widget-selected) {
		background-color: var(--overlay-highlight);
	}

	:global(.widget:hover) {
		background-color: var(--overlay-highlight);
	}

	/* Desktop overrides */
	@media only screen and (min-width: 720px) {
		:global(dl) {
			display: grid;
			grid-template-columns: auto 1fr;
			grid-auto-flow: column;
			grid-gap: calc(var(--padding) / 2) var(--padding);
		}
		:global(dt) {
			grid-column-start: 1;
		}
		:global(.container) {
			flex-direction: row;
		}
		main {
			max-width: 100vw;
		}
		nav {
			background-color: var(--overlay);
			backdrop-filter: blur(var(--radius));
		}
	}

	/* Color preference overrides */
	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--overlay: rgba(25, 25, 25, 0.5);
			--overlay-highlight: rgba(23, 33, 36, 0.8);
			--background: rgb(7, 18, 21);
			--border: rgb(35, 35, 35);
			--shadow: rgba(0, 0, 0, 0.6);
		}
		:global(body) {
			color: #eee;
			background-image: url('/img/dark.jpg');
		}
		:global(h1, h2, h3, h4, h5, h6) {
			color: #eee;
		}
		nav {
			color: white;
		}
	}
</style>
