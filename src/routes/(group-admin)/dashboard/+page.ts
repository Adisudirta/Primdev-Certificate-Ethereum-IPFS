import { CertificateService } from '$lib/api/services/certificate-service';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	// Check if the latest certificate is empty, then fill it with empty array
	const latestCertificates = await CertificateService.getLatestUpdatedCertificateData();
	if (!latestCertificates) {
		await CertificateService.updateCertificateIPFS({
			certificates: []
		});
	}

	const certificateEvents = await CertificateService.getLatestUpdatedCertificateData();
	return {
		certificateEvents: certificateEvents
	};
};
