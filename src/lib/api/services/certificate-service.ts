import type { Certificate, CertificateList, Participant } from '$lib/api/models/certificate';

import { get } from 'svelte/store';
import { page } from '$app/stores';
import { IPFSRepository } from '../repositories/ipfs-repository';
import { certificateMetadata } from '$lib/constants/certificate';
import { latestCertificateCID } from '$lib/stores/certificate';
import { toast } from 'svelte-sonner';

export class CertificateService {
	static async validateCertificate(data: { code: string; fullName: string }): Promise<boolean> {
		const cidOnBlockChain = get(page).data.currentCIDOnBlockchain;

		if (!cidOnBlockChain) {
			toast.error('No certificate found on blockchain. Please try again later.');
			return false;
		}

		const res = await IPFSRepository.retrieveJSONFromIPFS<CertificateList>(cidOnBlockChain);

		const certificateEvent = res.certificates.find(
			(certificate) => certificate.eventCode === data.code
		);

		if (!certificateEvent) {
			toast.error('Invalid certificate code');
			return false;
		}

		if (certificateEvent.participants && certificateEvent.participants?.length === 0) {
			toast.error('No participants found');
			return false;
		} else {
			const participant = certificateEvent.participants!.find(
				(participant) => participant.name === data.fullName
			);

			if (!participant) {
				toast.error('Invalid name');
				return false;
			}

			return true;
		}
	}

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
