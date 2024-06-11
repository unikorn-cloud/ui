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
	if (f.spec.gpu) {
		return `${f.metadata.name} (${f.spec.cpus} core, ${f.spec.memory}Gi, ${f.spec.gpu.count} GPU ${f.spec.gpu.vendor} ${f.spec.gpu.model})`;
	} else {
		return `${f.metadata.name} (${f.spec.cpus} core, ${f.spec.memory}Gi)`;
	}
}

export function timeOfDayFormatter(x: Hour) {
	if (x < 10) {
		return `0${x}:00 UTC`;
	}

	return `${x}:00 UTC`;
}
