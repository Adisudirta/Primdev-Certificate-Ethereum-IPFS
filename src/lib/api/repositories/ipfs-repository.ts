import { env } from '$env/dynamic/public';

import { pinataAPI } from '$lib/utils/api';
import ky from 'ky';

import type {
	ListFilesResponse,
	PinJSONToIPFSResponse,
	TestAuthenticationResponse
} from '../models/IPFS';
import { certificateMetadata } from '$lib/constants/certificate';

export class IPFSRepository {
	static async testAuthentication(): Promise<TestAuthenticationResponse> {
		const res = await pinataAPI.get('data/testAuthentication');
		return res.json();
	}

	static async pinJSONToIPFS<T>(requestBody: T): Promise<PinJSONToIPFSResponse> {
		const res = await pinataAPI.post('pinning/pinJSONToIPFS', {
			json: {
				pinataOptions: {
					cidVersion: 1
				},
				pinataMetadata: {
					name: certificateMetadata.FILE_NAME
				},
				pinataContent: requestBody
			}
		});
		return res.json();
	}

	static async listFiles(): Promise<ListFilesResponse> {
		const res = await pinataAPI.get('data/pinList');
		return res.json();
	}

	static async unpinFile(CID: string) {
		await pinataAPI.delete(`pinning/unpin/${CID}`);
	}

	static async retrieveJSONFromIPFS<T>(CID: string): Promise<T> {
		const res = ky.get(`${env.PUBLIC_PINATA_GATEWAY}${CID}`);
		return res.json();
	}
}
