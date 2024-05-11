import { ethers } from 'ethers';
import CertificateManager from '$lib/smart-contract/artifacts/src/lib/smart-contract/contracts/CertificateManager.sol/CertificateManager.json';
import { toast } from 'svelte-sonner';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

interface WindowEthereum extends Window {
	ethereum?: import('ethers').Eip1193Provider;
}

export class BlockchainService {
	static async setCurrentCIDToBlockchain(cid: string) {
		try {
			const ethereum = (window as WindowEthereum).ethereum;

			if (!ethereum) {
				return;
			}

			const provider = new ethers.BrowserProvider(ethereum);
			const signer = await provider.getSigner();
			const certificateManager = new ethers.Contract(
				CONTRACT_ADDRESS,
				CertificateManager.abi,
				signer
			);

			await certificateManager.setCurrentCID(cid);
		} catch {
			toast.error('Error while setting the CID');
		}
	}

	static async getCurrentCIDOnBlockchain(): Promise<string | undefined> {
		try {
			const ethereum = (window as WindowEthereum).ethereum;

			if (!ethereum) {
				return;
			}

			const provider = new ethers.BrowserProvider(ethereum);
			const signer = await provider.getSigner();
			const certificateManager = new ethers.Contract(
				CONTRACT_ADDRESS,
				CertificateManager.abi,
				signer
			);
			const currentCID = await certificateManager.getCurrentCID();

			return currentCID;
		} catch {
			toast.error('Error while getting the CID');
		}
	}
}
