import { env } from '$env/dynamic/public';

import { pinataAPI } from '$lib/utils/api';
import ky from 'ky';

import type { PinJSONToIPFSRequest } from '../models/requests/IPFS-request';
import type {
	ListFilesResponse,
	PinJSONToIPFSResponse,
	TestAuthenticationResponse
} from '../models/responses/IPFS-response';

export class IPFSRepository {
	static async testAuthentication(): Promise<TestAuthenticationResponse> {
		const res = await pinataAPI.get('data/testAuthentication');
		return res.json();
	}

	static async pinJSONToIPFS<T>(
		requestBody: PinJSONToIPFSRequest<T>
	): Promise<PinJSONToIPFSResponse> {
		const res = await pinataAPI.post('pinning/pinJSONToIPFS', {
			json: requestBody
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
