<script lang="ts">
	import { MetaMaskStore } from '$lib/stores/metamask';
	import { user } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';

	import { Button } from '$lib/components/ui/button';
	import LogoutButton from './(components)/logout-button.svelte';

	import { onMount } from 'svelte';

	const { connect, isMetaMaskPresent } = MetaMaskStore();

	$: !$user && goto('/login');

	// Test Pinata
	async function testPinata() {
		const token = env.PUBLIC_PINATA_JWT;
		const authOptions = { method: 'GET', headers: { Authorization: `Bearer ${token}` } };

		fetch('https://api.pinata.cloud/data/testAuthentication', authOptions)
			.then((response) => response.json())
			.then((response) => console.log(response))
			.catch((err) => console.error(err));

		// const pinToJSONOptions = {
		// 	method: 'POST',
		// 	headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		// 	body: '{"pinataOptions":{"cidVersion":1},"pinataMetadata":{"name":"pinnie.json"},"pinataContent":{"somekey":"somevalue"}}'
		// };

		// fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', pinToJSONOptions)
		// 	.then((response) => response.json())
		// 	.then((response) => console.log(response))
		// 	.catch((err) => console.error(err));

		// const pinListOptions = { method: 'GET', headers: { Authorization: `Bearer ${token}` } };

		// fetch('https://api.pinata.cloud/data/pinList', pinListOptions)
		// 	.then((response) => response.json())
		// 	.then((response) => console.log(response))
		// 	.catch((err) => console.error(err));

		await fetch(
			'https://fuchsia-reasonable-dove-524.mypinata.cloud/ipfs/bafkreicjmxc2drbgxtoidx6xfatbffyx46oiyo6ktipss6dhdermwtsoze'
		)
			.then((response) => response.json())
			.then((response) => console.log(response));
	}

	onMount(async () => {
		await testPinata();
	});
</script>

<section>
	<div class="container">
		<h1 class="mb-10 text-2xl">Dashboard Admin</h1>

		<LogoutButton />

		{#if !$isMetaMaskPresent}
			<Button on:click={async () => await connect()}>Connect Metamask</Button>
		{/if}
	</div>
</section>
