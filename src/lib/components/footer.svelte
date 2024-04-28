<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { CertificateService } from '$lib/api/services/certificate-service';
</script>

<footer class="h-10 w-full">
	<div class="container flex items-center justify-center">
		{#await CertificateService.getLatestCertificateCID()}
			<span>Loading...</span>
		{:then cid}
			{#if cid}
				<a
					href={`${env.PUBLIC_PINATA_GATEWAY}${cid}`}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-gray-500"
				>
					{cid}
				</a>
			{:else}
				<span>You have no Certificate data on IPFS!</span>
			{/if}
		{/await}
	</div>
</footer>
