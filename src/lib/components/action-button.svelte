<script lang="ts">
	import { EyeIcon, Trash2Icon } from 'lucide-svelte';
	import { Button } from './ui/button';

	export let handler: () => void;
	export let contentType: 'trash-icon' | 'eye-icon' | 'text' = 'text';
	export let text: string = '';
</script>

<Button on:click={handler} variant={contentType === 'trash-icon' ? 'destructive' : 'default'}>
	{#if contentType === 'trash-icon'}
		<Trash2Icon class="text-white" />
	{/if}

	{#if contentType === 'eye-icon'}
		<EyeIcon class="text-white" />
	{/if}

	{#if contentType === 'text'}
		{text}
	{/if}
</Button>
