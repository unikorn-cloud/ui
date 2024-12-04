<script lang="ts">
	import * as Region from '$lib/openapi/region';

	export let image: Region.Image;

	function getIcon(): string {
		if (!image) return 'mdi:question-mark';

		switch (image.spec.os.distro) {
			case Region.OsDistro.Rocky:
				return 'logos:rocky-linux';
			case Region.OsDistro.Ubuntu:
				return 'logos:ubuntu';
		}

		switch (image.spec.os.family) {
			case Region.OsFamily.Redhat:
				return 'logos:redhat';
			case Region.OsFamily.Debian:
				return 'logos:debian';
		}

		switch (image.spec.os.kernel) {
			case Region.OsKernel.Linux:
				return 'logos:linux';
		}

		return 'mdi:question-mark';
	}

	function toTitleCase(word: string): string {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}
</script>

{#if image}
	<div class="flex items-center gap-4">
		<iconify-icon class="pr-1 text-2xl" icon={getIcon()} />

		{toTitleCase(image.spec.os.distro)}

		{#if image.spec.os.variant}
			{toTitleCase(image.spec.os.variant)}
		{/if}

		{image.spec.os.version}

		{#if image.spec.os.codename}
			({toTitleCase(image.spec.os.codename)})
		{/if}
	</div>
{/if}
