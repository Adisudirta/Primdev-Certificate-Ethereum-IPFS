<script lang="ts">
	import { Github, CircleUserRound } from 'lucide-svelte';

	import { user } from '$lib/stores/auth';
	import { cn } from '$lib/utils/ui';

	import logoPrimdev from '$lib/assets/logo-primaraka-developers.svg';

	import Button from '$lib/components/ui/button/button.svelte';
	import LogoutButton from './logout-button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	export let type: 'default' | 'validator' = 'default';

	let yAxis: number;
</script>

<svelte:window bind:scrollY={yAxis} />

<header class={cn('fixed z-50 w-full transition', yAxis > 20 && 'backdrop-blur')}>
	<div class="container flex h-[75px] items-center justify-between">
		<img class="w-[200px] object-contain" src={logoPrimdev} alt="Logo Primakara Developers" />

		{#if type === 'validator'}
			<Button
				href="https://github.com/Adisudirta/Primdev-Certificate-Ethereum-IPFS"
				target="_blank"
				variant="default"
			>
				<Github class="mr-1" />

				<span>Contribute</span>
			</Button>
		{/if}

		{#if type === 'default'}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<div class="flex items-center space-x-2">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
							<CircleUserRound class="text-white" />
						</div>

						{#if $user}
							<span class="text-lg text-primary">{$user.email}</span>
						{:else}
							<span class="text-lg text-primary">Loading...</span>
						{/if}
					</div>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content align="end">
					<DropdownMenu.Group>
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
						<DropdownMenu.Separator />

						<div class="px-1 py-3">
							<LogoutButton />
						</div>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</div>
</header>
