<script lang="ts">
	import * as Dialog from './ui/dialog/index.js';
	import { buttonVariants } from './ui/button/index.js';

	export let triggerText: string;
	export let title: string;
	export let description: string = '';
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>{triggerText}</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>

			{#if description}
				<Dialog.Description>
					{description}
				</Dialog.Description>
			{/if}
		</Dialog.Header>

		<slot />
	</Dialog.Content>
</Dialog.Root>
