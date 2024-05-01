<script lang="ts">
	import { page } from '$app/stores';
	import { latestCertificateCID } from '$lib/stores/certificate';

	$: cid = $latestCertificateCID ?? $page.data.currentCID;
</script>

<footer class="h-10 w-full">
	<div class="container flex items-center justify-center">
		{#if cid}
			<a
				href={`https://ipfs.io/ipfs/${cid}?filename=${cid}`}
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm text-gray-500"
			>
				{cid}
			</a>
		{:else}
			<span>You have no Certificate data on IPFS!</span>
		{/if}
	</div>
</footer>
