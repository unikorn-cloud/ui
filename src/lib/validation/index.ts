export type NamedResourceSpec = {
	name: string;
};

export type NamedResource = {
	spec: NamedResourceSpec;
};

export function kubernetesNameValid(name: string | null | undefined): boolean {
	if (!name) return false;
	// RFC-1123.  Must start and end with alphanumeric.
	// Upto 63 characters, lower case alpha, numeric and -.
	return name.match(/^(?!-)[a-z0-9-]{0,62}[a-z0-9]$/) != null;
}

export function namedResourceNames(
	resources: Array<NamedResource> | null | undefined
): Array<string> {
	if (!resources) return [];
	return resources.map((x) => x.spec.name);
}

export function unique(needle: string, haystack: Array<string>): boolean {
	if (haystack == null) return true;
	return !haystack.includes(needle);
}
