<script lang="ts">
	import { EyeIcon } from 'lucide-svelte';
	import { Button } from './ui/button';

	export let handler: () => void;
	export let contentType: 'eye-icon' | 'text' = 'text';
	export let text: string = '';
</script>

<Button on:click={handler}>
	{#if contentType === 'eye-icon'}
		<EyeIcon class="text-white" />
	{/if}

	{#if contentType === 'text'}
		{text}
	{/if}
</Button>
