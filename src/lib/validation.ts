export function kubernetesNameValid(name: string): boolean {
	if (name == null) return false;
	// RFC-1123.  Must start and end with alphanumeric.
	// Upto 63 characters, lower case alpha, numeric and -.
	return name.match(/^(?!-)[a-z0-9-]{0,62}[a-z0-9]$/) != null;
}

export function namedResourceNames(resources: any): Array<string> {
	if (resources == null) return null;
	return resources.map((x) => x.name);
}

export function unique(needle: string, haystack: Array<string>): boolean {
	if (haystack == null) return true;
	return haystack.includes(needle);
}
