<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	import LogoutButton from './(components)/logout-button.svelte';

	onMount(() => {
		if (!$user) goto('/login');
	});
</script>

<section>
	<div class="container">
		<h1 class="mb-10 text-2xl">Dashboard Admin</h1>

		<LogoutButton />
	</div>
</section>
