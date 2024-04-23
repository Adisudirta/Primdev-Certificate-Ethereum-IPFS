<script lang="ts">
	import { metamask } from '$lib/stores/metamask';
	import { onMount } from 'svelte';

	import Loading from './loading.svelte';
	import InstallMetamask from './install-metamask.svelte';

	const { walletState, isMetaMaskPresent, loaded, init } = metamask();

	onMount(() => {
		init();
	});
</script>

{#if $loaded}
	{#if $isMetaMaskPresent || Boolean($walletState.account)}
		<slot />
	{:else}
		<InstallMetamask />
	{/if}
{:else}
	<Loading message="Waiting Metamask..." />
{/if}
