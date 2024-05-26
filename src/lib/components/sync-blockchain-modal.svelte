<script lang="ts">
	import { cn } from '$lib/utils/ui.js';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import { BlockchainService } from '$lib/api/services/blockchain-service';
	import { CertificateService } from '$lib/api/services/certificate-service';
	import { invalidateAll } from '$app/navigation';
	import { latestCertificateCID } from '$lib/stores/certificate';

	import { ShieldCheckIcon, ShieldXIcon } from 'lucide-svelte';

	import globeIllustration from '../assets/globe.png';
	import * as Dialog from './ui/dialog/index.js';
	import { Button, buttonVariants } from './ui/button';
	import { ethers, toUtf8Bytes } from 'ethers';

	let isSynchronizing = false;

	$: currentCIDOnBlockchain = $page.data.currentCIDOnBlockchain as string | undefined;
	$: currentCID = $latestCertificateCID ?? ($page.data.currentCID as string | null);

	$: isSynchronized = ethers.keccak256(toUtf8Bytes(currentCID!)) === currentCIDOnBlockchain;

	async function synchronizeBlockchain() {
		toast.promise(
			async () => {
				isSynchronizing = true;
				const currentCIDOnIPFS = await CertificateService.getLatestCertificateCID();

				await BlockchainService.setCurrentCIDToBlockchain(currentCIDOnIPFS!);
				isSynchronizing = false;
			},
			{
				loading: 'Synchronizing IPFS to blockchain...',
				success: () => {
					invalidateAll();
					return 'Synchronizing successfully';
				},
				error: 'Something went wrong! Please try again!'
			}
		);
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: isSynchronized ? 'default' : 'destructive' })}>
		{#if isSynchronized}
			<ShieldCheckIcon class="mr-2" />
			Blockchain Synchronized
		{:else if isSynchronizing}
			Synchronizing Blockchain...
		{:else}
			<ShieldXIcon class="mr-2" />
			Blockchain Not Synchronized
		{/if}
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-[425px]">
		<div class="flex flex-col items-center justify-center space-y-5">
			<img
				src={globeIllustration}
				alt="Globe Illustration"
				class={cn('w-[500px] object-contain object-center', isSynchronizing && 'animate-pulse')}
			/>

			<div class="inline-flex flex-col space-x-2">
				<h1
					class={cn(
						'text-center text-2xl font-bold',
						isSynchronized ? 'text-primary' : 'text-red-500'
					)}
				>
					{#if isSynchronizing}
						Synchronizing IPFS to Blockchain...
					{:else if isSynchronized}
						Blockchain Synchronized
					{:else}
						IPFS Not Synchronized
					{/if}
				</h1>
				<p class="text-center">
					{#if isSynchronizing}
						Please wait while we synchronize your IPFS data to the blockchain.
					{:else if isSynchronized}
						Your IPFS data is synchronized to the blockchain.
					{:else}
						Your IPFS data is not synchronized to the blockchain.
					{/if}
				</p>
			</div>

			<Button
				on:click={synchronizeBlockchain}
				disabled={isSynchronized || isSynchronizing}
				class="w-full"
			>
				{#if isSynchronizing}
					Synchronizing...
				{:else if isSynchronized}
					Synchronized
				{:else}
					Synchronize
				{/if}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
