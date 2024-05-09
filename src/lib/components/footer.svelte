<script lang="ts">
	import { page } from '$app/stores';
	import { latestCertificateCID } from '$lib/stores/certificate';

	$: cid = $latestCertificateCID ?? $page.data.currentCID;
</script>

<footer class="h-12 w-full">
	<div class="container flex h-full items-center justify-center">
		{#if cid}
			<a
				href={`https://ipfs.io/ipfs/${cid}?filename=${cid}`}
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm text-gray-500"
			>
				Current CID: {cid}
			</a>
		{:else}
			<span>You have no Certificate data on IPFS!</span>
		{/if}
	</div>
</footer>
