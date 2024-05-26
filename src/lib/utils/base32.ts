import CID from 'cids';
import * as multihashes from 'multihashes';

function cidToBytes32(cid: string): string {
	const cidObject = new CID(cid);
	const multihash = cidObject.multihash;
	return multihashes.toHexString(multihash);
}

export { cidToBytes32 };
