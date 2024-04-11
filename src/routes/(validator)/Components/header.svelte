<script lang="ts">
	import LogoPrimdev from '$lib/assets/logo-primaraka-developers.svg';
	import { Github } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils/ui';

	let yAxis: number;
</script>

<svelte:window bind:scrollY={yAxis} />

<header class={cn('fixed z-50 w-full transition', yAxis > 20 && 'backdrop-blur')}>
	<div class="container flex h-[75px] items-center justify-between">
		<img class="w-[200px] object-contain" src={LogoPrimdev} alt="Logo Primakara Developers" />

		<Button
			href="https://github.com/Adisudirta/Primdev-Certificate-Ethereum-IPFS"
			target="_blank"
			variant="default"
		>
			<Github class="mr-1" />

			<span>Contribute</span>
		</Button>
	</div>
</header>
