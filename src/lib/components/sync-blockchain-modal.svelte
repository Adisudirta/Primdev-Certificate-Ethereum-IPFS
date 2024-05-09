<script lang="ts">
	import { cn } from '$lib/utils/ui.js';

	import { ShieldCheckIcon, ShieldXIcon } from 'lucide-svelte';

	import * as Dialog from './ui/dialog/index.js';
	import { Button, buttonVariants } from './ui/button';
	import GlobeIllustration from '../assets/globe.png';

	let isSynchronizing = false;
	let isSynchronized = false;
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: isSynchronized ? 'default' : 'destructive' })}>
		{#if isSynchronized}
			<ShieldCheckIcon class="mr-2" />
			Blockchain Synchronized
		{:else}
			<ShieldXIcon class="mr-2" />
			Blockchain Not Synchronized
		{/if}
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-[425px]">
		<div class="flex flex-col items-center justify-center space-y-5">
			<img
				src={GlobeIllustration}
				alt="Globe Illustration"
				class={cn('w-[500px] object-contain object-center', isSynchronizing && 'animate-pulse')}
			/>

			<div class="inline-flex flex-col space-x-2">
				<h1 class="text-center text-2xl font-bold text-primary">Synchronize IPFS to Blockchain</h1>
				<p class="text-center">Synchronize current data on IPFS to the Ethereum blockchain.</p>
			</div>

			<Button class="w-full" disabled={isSynchronized}>
				{#if isSynchronizing}
					Synchronizing...
				{:else if isSynchronized}
					Synchronized
				{:else}
					Synchronize
				{/if}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
