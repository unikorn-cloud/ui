export type NamedResource = {
	name: string;
};

export type NamedResourceWithSpec = {
	metadata: NamedResource;
};

export type NamedResourceUnion = NamedResource | NamedResourceWithSpec;

export function kubernetesNameValid(name: string | null | undefined): boolean {
	if (!name) return false;
	// RFC-1123.  Must start and end with alphanumeric.
	// Upto 63 characters, lower case alpha, numeric and -.
	return name.match(/^(?!-)[a-z0-9-]{0,62}[a-z0-9]$/) != null;
}

export function namedResourceNames(
	resources: Array<NamedResourceUnion> | null | undefined
): Array<string> {
	if (!resources) return [];

	return resources.map((x) => {
		if ('metadata' in x) {
			return (x as NamedResourceWithSpec).metadata.name;
		}

		return x.name;
	});
}

export function unique(needle: string, haystack: Array<string>): boolean {
	if (haystack == null) return true;
	return !haystack.includes(needle);
}
