import type { LayoutLoad } from './$types';
import { BlockchainService } from '$lib/api/services/blockchain-service';
import { CertificateService } from '$lib/api/services/certificate-service';

export const load: LayoutLoad = async ({ depends }) => {
	const currentCID = await CertificateService.getLatestCertificateCID();
	const currentCIDOnBlockchain = await BlockchainService.getCurrentCIDOnBlockchain();

	depends('app:dashboard');

	return {
		currentCID,
		currentCIDOnBlockchain
	};
};
