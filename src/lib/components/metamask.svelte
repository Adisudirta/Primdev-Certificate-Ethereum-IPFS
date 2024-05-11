<script lang="ts">
	import { metamask } from '$lib/stores/metamask';
	import { onMount } from 'svelte';

	import * as Dialog from './ui/dialog/index.js';
	import metamaskLogo from '../assets/metamask.png';
	import Button from './ui/button/button.svelte';

	const { walletState, isMetaMaskPresent, loaded, init, connect } = metamask();

	onMount(() => {
		init();
	});

	$: isDialogOpen = !$walletState.account;
</script>

<Dialog.Root open={isDialogOpen}>
	<Dialog.Content class="h-[500px] w-[425px]">
		{#if $loaded}
			{#if !$isMetaMaskPresent}
				<div class="flex h-full w-full flex-col items-center justify-center space-y-5">
					<img
						class="w-[200px] animate-pulse object-contain object-center"
						src={metamaskLogo}
						alt="Metamask Logo"
					/>

					<div>
						<h1 class="text-center text-xl font-bold text-primary">
							Looks like you doesn't have Metamask installed
						</h1>
						<p class="text-center text-lg text-gray-500">
							Sorry about that! Please install Metamask and you can come back here.
						</p>
					</div>

					<Button
						class="w-fit"
						href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?pli=1"
						target="_blank"
					>
						Take me there!
					</Button>
				</div>
			{:else}
				<div class="flex h-full w-full flex-col items-center justify-center space-y-5">
					<img
						class="w-[200px] animate-pulse object-contain object-center"
						src={metamaskLogo}
						alt="Metamask Logo"
					/>

					<div>
						<h1 class="text-center text-xl font-bold text-primary">
							Looks like you doesn't have Metamask installed
						</h1>
						<p class="text-center text-lg text-gray-500">
							Sorry about that! Please install Metamask and you can come back here.
						</p>
					</div>

					<Button on:click={connect}>Connect Metamask</Button>
				</div>
			{/if}
		{:else}
			<div class="flex h-full w-full flex-col items-center justify-center space-y-2">
				<img
					class="w-[300px] animate-pulse object-contain object-center"
					src={metamaskLogo}
					alt="Metamask Logo"
				/>

				<span class="text-lg font-bold text-primary">Loading metamask...</span>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
