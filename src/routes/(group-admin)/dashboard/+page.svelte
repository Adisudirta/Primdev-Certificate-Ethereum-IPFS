<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { MetaMaskStore } from '$lib/stores/metamask';

	import LogoutButton from './(components)/logout-button.svelte';

	const { walletState, isMetaMaskPresent, connect, loaded, init } = MetaMaskStore();

	onMount(() => {
		if (!$user) goto('/login');
		init();
	});
</script>

<section>
	<div class="container">
		<h1 class="mb-10 text-2xl">Dashboard Admin</h1>

		<LogoutButton />

		<div class="mt-10">
			<h1>Welcome to SvelteKit</h1>

			{#if $loaded}
				{#if $isMetaMaskPresent}
					{#if Boolean($walletState.account)}
						<p>{$walletState.account}</p>
					{:else}
						<button on:click={connect}>Connect Wallet</button>
					{/if}
				{:else}
					<p>Please install MetaMask</p>
				{/if}
			{:else}
				<p>Loading...</p>
			{/if}
		</div>
	</div>
</section>
