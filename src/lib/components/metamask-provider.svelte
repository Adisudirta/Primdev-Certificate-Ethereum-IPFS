<script lang="ts">
	import { MetaMaskStore } from '$lib/stores/metamask';
	import { onMount } from 'svelte';

	import Loading from './loading.svelte';
	import InstallMetamask from './install-metamask.svelte';

	const { walletState, isMetaMaskPresent, connect, loaded, init } = MetaMaskStore();

	onMount(() => {
		init();
	});
</script>

{#if $loaded}
	{#if $isMetaMaskPresent}
		{#if Boolean($walletState.account)}
			<slot />
		{:else}
			<button on:click={connect}>Connect Wallet</button>
		{/if}
	{:else}
		<InstallMetamask />
	{/if}
{:else}
	<Loading />
{/if}
