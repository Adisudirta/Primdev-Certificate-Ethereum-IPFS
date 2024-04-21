<script lang="ts">
	import { metamask } from '$lib/stores/metamask';
	import { user } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	import { Button } from '$lib/components/ui/button';

	import { onMount } from 'svelte';
	import { IPFSRepository } from '$lib/api/repositories/ipfs-repository';

	const { connect, isMetaMaskPresent } = metamask();

	$: !$user && goto('/login');

	onMount(async () => {
		const res = await IPFSRepository.retrieveJSONFromIPFS(
			'bafkreicjmxc2drbgxtoidx6xfatbffyx46oiyo6ktipss6dhdermwtsoze'
		);
		console.log(res);
	});
</script>

<section class="container">
	<h1 class="mb-10 mt-20 text-3xl font-bold text-primary">Dashboard Admin</h1>

	{#if !$isMetaMaskPresent}
		<Button on:click={async () => await connect()}>Connect Metamask</Button>
	{/if}
</section>
