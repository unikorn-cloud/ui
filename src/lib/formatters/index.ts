import * as Region from '$lib/openapi/region';

export type NamedObject = {
	name: string;
};

export type ApplicationBundle = {
	version: string;
	preview?: string;
	endOfLife?: string;
};

export type Hour = number;

export function namedObjectFormatter(o: NamedObject): string {
	return o.name;
}

export function applicationBundleFormatter(b: ApplicationBundle) {
	if (b.preview) {
		return `${b.version} (Preview)`;
	} else if (b.endOfLife) {
		return `${b.version} (EOL ${new Date(b.endOfLife).toDateString()})`;
	} else {
		return b.version;
	}
}

export function flavorFormatter(f: Region.Flavor) {
	let family = '';

	if (f.spec.cpuFamily) family = ' ' + f.spec.cpuFamily;

	let gpu = '';

	if (f.spec.gpu)
		gpu = `, ${f.spec.gpu.count} GPU ${f.spec.gpu.vendor} ${f.spec.gpu.model} ${f.spec.gpu.memory}Gi`;

	return `${f.metadata.name} ${f.spec.cpus} core${family}, ${f.spec.memory}Gi${gpu}`;
}

export function timeOfDayFormatter(x: Hour) {
	if (x < 10) {
		return `0${x}:00 UTC`;
	}

	return `${x}:00 UTC`;
}

export function ageFormatter(time: Date): string {
	// Get age of the instance in seconds.
	const now = Date.now();

	let age = Math.round((now - time.valueOf()) / 1000);

	const seconds = age % 60;
	age = Math.round(age / 60);

	if (!age) return `${seconds}s`;

	const minutes = age % 60;
	age = Math.round(age / 60);

	if (!age) return `${minutes}m ${seconds}s`;

	const hours = age % 24;
	age = Math.round(age / 24);

	if (!age) return `${hours}h ${minutes}m ${seconds}s`;

	return `${age}d ${hours}h ${minutes}m ${seconds}s`;
}
