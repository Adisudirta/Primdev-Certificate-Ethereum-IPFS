import type { Certificate, CertificateList, Participant } from '$lib/api/models/certificate';

import { get } from 'svelte/store';
import { IPFSRepository } from '../repositories/ipfs-repository';
import { certificateMetadata } from '$lib/constants/certificate';
import { latestCertificateCID } from '$lib/stores/certificate';

export class CertificateService {
	static async updateCertificateIPFS(content: CertificateList): Promise<void> {
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

	static async deleteCertificateEvent(eventCode: string): Promise<void> {
		const latestCertificateData = await this.getLatestUpdatedCertificateData();

		const newCertificateData = latestCertificateData?.certificates.filter(
			(certificate) => certificate.eventCode !== eventCode
		);

		if (newCertificateData) {
			await this.updateCertificateIPFS({ certificates: newCertificateData });
		}
	}

	static async getDetailCertificateEvents(eventCode: string): Promise<Certificate | undefined> {
		const latestCertificateData = await this.getLatestUpdatedCertificateData();

		const certificate = latestCertificateData?.certificates.find(
			(certificate) => certificate.eventCode === eventCode
		);

		return certificate;
	}

	static async editCertificateEvent(
		eventCode: string,
		certificateData: { eventName: string; expired?: string }
	): Promise<void> {
		const latestCertificateData = await this.getLatestUpdatedCertificateData();

		const newCertificateData = latestCertificateData?.certificates.map((certificate) => {
			if (certificate.eventCode === eventCode) {
				return { ...certificate, ...certificateData };
			}

			return certificate;
		});

		if (newCertificateData) {
			await this.updateCertificateIPFS({ certificates: newCertificateData });
		}
	}

	static async revokeCertificateEvent(eventCode: string): Promise<void> {
		const latestCertificateData = await this.getLatestUpdatedCertificateData();

		const newCertificateData = latestCertificateData?.certificates.map((certificate) => {
			if (certificate.eventCode === eventCode) {
				return { ...certificate, status: 'NOT_AVAILABLE' } as Certificate;
			}

			return certificate;
		});

		if (newCertificateData) {
			await this.updateCertificateIPFS({ certificates: newCertificateData });
		}
	}

	static async addParticipantToCertificateEvent(eventCode: string, participant: Participant) {
		const latestCertificateData = await this.getLatestUpdatedCertificateData();

		const newCertificateData = latestCertificateData?.certificates.map((certificate) => {
			if (certificate.eventCode === eventCode) {
				return {
					...certificate,
					participants: certificate.participants
						? [...certificate.participants, participant]
						: [participant]
				} as Certificate;
			}

			return certificate;
		});

		if (newCertificateData) {
			await this.updateCertificateIPFS({ certificates: newCertificateData });
		}
	}

	static async deleteParticipantFromCertificateEvent(eventCode: string, email: string) {
		const latestCertificateData = await this.getLatestUpdatedCertificateData();
		const filteredCertificateData = latestCertificateData?.certificates.filter(
			(certificate) => certificate.eventCode === eventCode
		)[0];

		const newParticipantData = filteredCertificateData?.participants?.filter(
			(participant) => participant.email !== email
		);

		const updatedAllCertificateData = latestCertificateData?.certificates.map((certificate) => {
			if (certificate.eventCode === eventCode) {
				return { ...certificate, participants: newParticipantData ?? [] } as Certificate;
			}

			return certificate;
		});

		if (updatedAllCertificateData) {
			await this.updateCertificateIPFS({ certificates: updatedAllCertificateData });
		}
	}
}
