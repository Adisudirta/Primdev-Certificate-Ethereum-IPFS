import { IPFSRepository } from '../repositories/ipfs-repository';
import { certificateMetadata } from '$lib/constants/certificate';
import type { CertificateList } from '$lib/api/models/certificate';
import { latestCertificateCID } from '$lib/stores/certificate';
import { get } from 'svelte/store';

export class CertificateService {
	static async updateCertificateIPFS(content: CertificateList) {
		const listFiles = await IPFSRepository.listFiles();
		const certificates = listFiles.rows.filter(
			(file) =>
				file.date_unpinned === null &&
				file.mime_type === 'application/json' &&
				file.metadata.name === certificateMetadata.FILE_NAME
		);

		if (certificates.length !== 0) {
			certificates.forEach(async (certificate) => {
				await IPFSRepository.unpinFile(certificate.ipfs_pin_hash);
			});
		}

		const res = await IPFSRepository.pinJSONToIPFS<CertificateList>(content);
		latestCertificateCID.set(res.IpfsHash);
	}

	static async getLatestCertificateCID(): Promise<string | null> {
		const listFiles = await IPFSRepository.listFiles();

		const certificates = listFiles.rows.find(
			(file) =>
				file.date_unpinned === null &&
				file.mime_type === 'application/json' &&
				file.metadata.name.split('.')[0] === certificateMetadata.FILE_NAME
		);

		if (!certificates) {
			return null;
		}

		return certificates.ipfs_pin_hash;
	}

	static async getLatestUpdatedCertificateData(): Promise<CertificateList | null> {
		const currentCIDFromStore = get(latestCertificateCID);
		const certificateCIDFromAPI = await this.getLatestCertificateCID();

		if (!certificateCIDFromAPI && !currentCIDFromStore) {
			return null;
		}

		const cidUsed = currentCIDFromStore ?? certificateCIDFromAPI;

		const res = await IPFSRepository.retrieveJSONFromIPFS<CertificateList>(cidUsed!);

		return res;
	}

	static async deleteCertificateEvent(eventCode: string) {
		const latestCertificateData = await this.getLatestUpdatedCertificateData();

		const newCertificateData = latestCertificateData?.certificates.filter(
			(certificate) => certificate.eventCode !== eventCode
		);

		if (newCertificateData) {
			await this.updateCertificateIPFS({ certificates: newCertificateData });
		}
	}
}
