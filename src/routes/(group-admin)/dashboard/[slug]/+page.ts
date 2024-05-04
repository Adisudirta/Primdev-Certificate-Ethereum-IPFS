import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { CertificateService } from '$lib/api/services/certificate-service';

export const load: PageLoad = async ({ params }) => {
	const slug = params.slug;
	const detail = await CertificateService.getDetailCertificateEvents(slug);

	if (!detail) {
		error(404, {
			message: 'Not found'
		});
	}

	return detail;
};
