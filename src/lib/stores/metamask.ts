import { writable } from 'svelte/store';
import { localStorageKey } from '$lib/constants/local-storage';

const getMetaMaskPresent = () =>
	// @ts-expect-error - window expect have ethereum
	typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';

const getLocalStorageState = () => {
	// if not in browser, return empty object
	if (typeof window === 'undefined') {
		return {};
	}

	return JSON.parse(localStorage.getItem(localStorageKey.WALLET_STATE) || '{}');
};

export function metamask() {
	const loaded = writable(false);
	const isMetaMaskPresent = writable(getMetaMaskPresent());
	const walletState = writable(getLocalStorageState());

	// @ts-expect-error - newAccounts can be any
	const handleAccountsChanged = (newAccounts) => {
		if (Array.isArray(newAccounts) && newAccounts.length > 0 && newAccounts[0] !== undefined) {
			const account = newAccounts[0];
			walletState.set({ account });
		} else {
			walletState.set({});
		}
	};

	/**
	 * The `init` function checks if MetaMask is present and connected, and if so, automatically connects
	 * to it, otherwise it waits for the user to click connect.
	 * @returns The function `init` returns nothing.
	 */
	const init = async () => {
		// if metamask is not present, do nothing
		if (!getMetaMaskPresent()) {
			loaded.set(true);
			return;
		} else {
			loaded.set(true);
		}

		// if we have an account in local storage, we can assume the user left the page with metamask connected last time
		// so we can connect to metamask automatically
		if (getLocalStorageState().account) {
			// @ts-expect-error - window expect have ethereum
			const accountResponse = await window.ethereum?.request({
				method: 'eth_requestAccounts'
			});

			if (accountResponse && accountResponse.length && accountResponse[0]) {
				const account = accountResponse[0];
				walletState.set({ account });

				// watch for account changes from the extension
				// @ts-expect-error - window expect have ethereum
				window.ethereum?.on('accountsChanged', handleAccountsChanged);
			}
		}

		// if metamask is present, but not connected previously, we will wait for the user to click connect. For now, we will just set loaded to true
		const delayTimeOut = setTimeout(() => {
			// delay to allow a flashing screen and layout shift
			loaded.set(true);
		}, 500);

		clearInterval(delayTimeOut);

		// any time the wallet state changes, we will update local storage
		walletState.subscribe((state) => {
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(localStorageKey.WALLET_STATE, JSON.stringify(state));
			}
		});
	};

	const connect = async () => {
		// if metamask is not present, do nothing
		if (!getMetaMaskPresent()) {
			return;
		}

		// if metamask is present, but not connected, connect
		// @ts-expect-error - window expect have ethereum
		const accountResponse = await window.ethereum?.request({
			method: 'eth_requestAccounts'
		});

		if (accountResponse && accountResponse.length && accountResponse[0]) {
			const account = accountResponse[0];
			walletState.set({ account });
			// watch for account changes from the extension
			// @ts-expect-error - window expect have ethereum
			window.ethereum?.on('accountsChanged', handleAccountsChanged);
		}
	};

	return {
		isMetaMaskPresent,
		walletState,
		loaded,
		connect,
		init
	};
}
