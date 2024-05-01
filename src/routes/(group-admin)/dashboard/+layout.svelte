<script lang="ts">
	import { navigating } from '$app/stores';
	import Header from '$lib/components/header.svelte';
	import Loading from '$lib/components/loading.svelte';
</script>

{#if !$navigating}
	<Header />
	<main class="w-full pt-[75px]">
		<slot />
	</main>
{:else}
	<Loading />
{/if}
