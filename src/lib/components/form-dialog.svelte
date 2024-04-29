<script lang="ts">
	import * as Dialog from './ui/dialog/index.js';

	export let title: string;
	export let description: string = '';
	export let open: boolean | undefined = false;
</script>

<Dialog.Root bind:open>
	<slot name="trigger" />

	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>

			{#if description}
				<Dialog.Description>
					{description}
				</Dialog.Description>
			{/if}
		</Dialog.Header>

		<slot name="content" />
	</Dialog.Content>
</Dialog.Root>
