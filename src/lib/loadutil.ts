import { error } from '@sveltejs/kit';

interface Lengthable {
	length: number;
}

export async function assertNonEmptyList<Type extends Lengthable>(
	lister: Promise<Type>
): Promise<Type> {
	const list = await lister;

	if (list.length == 0) {
		error(500, `list type is unexpectedly empty, ensure your deployment is configured correctly`);
	}

	return list;
}
