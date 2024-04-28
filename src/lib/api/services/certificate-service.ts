import { IPFSRepository } from '../repositories/ipfs-repository';
import { certificateMetadata } from '$lib/constants/certificate';
import type { CertificateList } from '$lib/api/models/certificate';

export class CertificateService {
	static async updateCertificateIPFS(content: CertificateList) {
		const listFiles = await IPFSRepository.listFiles();
		const certificateHashes = listFiles.rows.filter(
			(file) =>
				file.date_unpinned === null &&
				file.mime_type === 'application/json' &&
				file.metadata.name === certificateMetadata.FILE_NAME
		);

		if (certificateHashes.length !== 0) {
			certificateHashes.forEach(async (certificateHash) => {
				await IPFSRepository.unpinFile(certificateHash.ipfs_pin_hash);
			});
		}

		await IPFSRepository.pinJSONToIPFS<CertificateList>(content);
	}

	static async getLatestCertificateCID(): Promise<string | null> {
		const listFiles = await IPFSRepository.listFiles();

		const certificateHash = listFiles.rows.find(
			(file) =>
				file.date_unpinned === null &&
				file.mime_type === 'application/json' &&
				file.metadata.name.split('.')[0] === certificateMetadata.FILE_NAME
		);

		if (!certificateHash) {
			return null;
		}

		return certificateHash.ipfs_pin_hash;
	}

	static async getLatestUpdatedCertificateData(): Promise<CertificateList | null> {
		const listFiles = await IPFSRepository.listFiles();

		const certificateHash = listFiles.rows.find(
			(file) =>
				file.date_unpinned === null &&
				file.mime_type === 'application/json' &&
				file.metadata.name.split('.')[0] === certificateMetadata.FILE_NAME
		);

		if (!certificateHash) {
			return null;
		}

		const res = await IPFSRepository.retrieveJSONFromIPFS<CertificateList>(
			certificateHash.ipfs_pin_hash
		);

		return res;
	}
}
