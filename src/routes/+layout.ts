import { CertificateService } from '$lib/api/services/certificate-service';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ depends }) => {
	const currentCID = await CertificateService.getLatestCertificateCID();
	depends('app:dashboard');
	return {
		currentCID: currentCID
	};
};
