import type { PageLoad } from './$types';
import { CertificateService } from '$lib/api/services/certificate-service';
import { appLoading } from '$lib/stores/loading';

export const load: PageLoad = async ({ depends }) => {
	appLoading.set(true);
	// Check if the latest certificate is empty, then fill it with empty array
	const latestCertificates = await CertificateService.getLatestUpdatedCertificateData();
	if (!latestCertificates) {
		await CertificateService.updateCertificateIPFS({
			certificates: []
		});
	}
	const certificateEvents = await CertificateService.getLatestUpdatedCertificateData();
	appLoading.set(false);

	depends('app:dashboard');
	return {
		certificateEvents: certificateEvents
	};
};
