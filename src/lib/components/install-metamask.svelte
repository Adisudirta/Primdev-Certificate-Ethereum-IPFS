<script lang="ts">
	import metamaskLogo from '$lib/assets/metamask.png';

	import { metamask } from '$lib/stores/metamask';

	import { Button } from './ui/button';

	const { walletState, connect } = metamask();

	let loading: boolean = false;
</script>

<div class="w-ful container flex h-screen items-center justify-between">
	<div class="flex flex-col space-y-5">
		{#if !$walletState.account}
			<h1 class="text-5xl font-bold text-primary">Looks like your Metamask is not connected</h1>
			<p class="text-xl text-gray-500">
				Sorry about that! Please connect your Metamask to use our website.
			</p>

			<Button
				class="w-fit"
				on:click={async () => {
					loading = true;
					await connect();
					loading = false;
				}}
				disabled={loading}
			>
				{loading ? 'Connecting Metamask...' : 'Connect Metamask'}
			</Button>
		{:else}
			<h1 class="text-5xl font-bold text-primary">
				Looks like you doesn't have Metamask installed
			</h1>
			<p class="text-xl text-gray-500">
				Sorry about that! Please install Metamask and you can come back here.
			</p>

			<Button
				class="w-fit"
				href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?pli=1"
				target="_blank"
			>
				Take me there!
			</Button>
		{/if}
	</div>

	<img src={metamaskLogo} class="w-[500px] object-contain grayscale" alt="Metamask Logo" />
</div>
