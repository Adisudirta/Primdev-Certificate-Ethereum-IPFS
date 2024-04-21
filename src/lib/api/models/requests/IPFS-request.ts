export interface PinJSONToIPFSRequest<T> {
	pinataOptions: {
		cidVersion: number;
	};
	pinataMetadata: {
		name: string;
	};
	pinataContent: T;
}
