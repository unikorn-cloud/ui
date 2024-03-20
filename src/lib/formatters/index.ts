export type NamedObject = {
	name: string;
};

export type ApplicationBundle = {
	version: string;
	preview?: string;
	endOfLife?: string;
};

export type Flavor = {
	name: string;
	cpus: number;
	memory: number;
	gpus?: number;
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

export function flavorFormatter(f: Flavor) {
	if (f.gpus) {
		return `${f.name} (${f.cpus} core, ${f.memory}Gi, ${f.gpus} GPU)`;
	} else {
		return `${f.name} (${f.cpus} core, ${f.memory}Gi)`;
	}
}

export function timeOfDayFormatter(x: Hour) {
	if (x < 10) {
		return `0${x}:00 UTC`;
	}

	return `${x}:00 UTC`;
}
