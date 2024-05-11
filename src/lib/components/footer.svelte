<script lang="ts">
	import { page } from '$app/stores';
	import { latestCertificateCID } from '$lib/stores/certificate';
	import { metamask } from '$lib/stores/metamask';

	const { walletState } = metamask();
	$: cid = $latestCertificateCID ?? $page.data.currentCID;
	$: cidOnBlockchain = $page.data.currentCIDOnBlockchain ?? 'No data on blockchain!';
</script>

<footer class="w-full">
	<div class="container flex h-full flex-col items-center justify-center space-y-2 py-5">
		{#if cid}
			<a
				href={`https://ipfs.io/ipfs/${cid}?filename=${cid}`}
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm text-gray-500"
			>
				Current CID: <span class="text-teal-600">{cid}</span>
			</a>

			<a
				href={`https://ipfs.io/ipfs/${cidOnBlockchain}?filename=${cidOnBlockchain}`}
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm text-gray-500"
			>
				Current CID on Blockchain: <span class="text-teal-600">{cidOnBlockchain}</span>
			</a>

			<span class="text-sm text-gray-500">
				Contract Address: <span class="text-teal-600">
					{$walletState.account ?? 'Metamask not connected!'}
				</span>
			</span>
		{:else}
			<span>You have no Certificate data on IPFS!</span>
		{/if}
	</div>
</footer>
