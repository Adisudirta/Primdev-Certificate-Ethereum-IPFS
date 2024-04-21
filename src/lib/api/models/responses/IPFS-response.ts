export type TestAuthenticationResponse = {
	message: string;
};

export type PinJSONToIPFSResponse = {
	IpfsHash: string;
	PinSize: number;
	Timestamp: string;
	isDuplicate: boolean;
};

export interface ListFilesResponse {
	rows: {
		id: string;
		ipfs_pin_hash: string;
		size: number;
		user_id: string;
		date_pinned: string;
		date_unpinned: string;
		metadata: {
			name: string;
			keyvalues: string;
		};
		regions: {
			regionId: string;
			currentReplicationCount: number;
			desiredReplicationCount: number;
		}[];
	}[];
}
