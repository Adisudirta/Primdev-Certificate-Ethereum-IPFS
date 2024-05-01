import type { PageLoad } from './$types';
import { CertificateService } from '$lib/api/services/certificate-service';

export const load: PageLoad = async ({ depends }) => {
	// Check if the latest certificate is empty, then fill it with empty array
	const latestCertificates = await CertificateService.getLatestUpdatedCertificateData();
	if (!latestCertificates) {
		await CertificateService.updateCertificateIPFS({
			certificates: []
		});
	}
	const certificateEvents = await CertificateService.getLatestUpdatedCertificateData();

	depends('app:dashboard');
	return {
		certificateEvents: certificateEvents
	};
};
