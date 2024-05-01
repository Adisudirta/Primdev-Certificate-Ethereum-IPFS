import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const slug = params.slug;
	console.log(slug);

	return {
		slug: slug
	};
};
