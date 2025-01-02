import * as Region from '$lib/openapi/region';

export function name(regions: Array<Region.RegionRead> | undefined, regionID: string): string {
	if (!regions || !regionID) {
		return 'unknown';
	}

	const region = regions.find((x) => x.metadata.id == regionID);
	if (!region) {
		return 'unknown';
	}

	return region.metadata.name;
}

export function icon(regions: Array<Region.RegionRead> | undefined, regionID: string): string {
	const regionName = name(regions, regionID);
	if (regionName === 'unknown') {
		return 'circle-flags:az';
	}

	return `circle-flags:${regionName.split('-')[0]}`;
}
