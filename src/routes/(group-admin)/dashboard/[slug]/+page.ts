import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { CertificateService } from '$lib/api/services/certificate-service';
import { appLoading } from '$lib/stores/loading';

export const load: PageLoad = async ({ params }) => {
	appLoading.set(true);
	const slug = params.slug;
	const detail = await CertificateService.getDetailCertificateEvents(slug);
	appLoading.set(false);

	if (!detail) {
		error(404, {
			message: 'Not found'
		});
	}

	return detail;
};
