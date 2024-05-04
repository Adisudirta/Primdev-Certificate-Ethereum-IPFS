import { CertificateService } from '$lib/api/services/certificate-service';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const slug = params.slug;
	const detail = await CertificateService.getDetailCertificateEvents(slug);

	return detail;
};
