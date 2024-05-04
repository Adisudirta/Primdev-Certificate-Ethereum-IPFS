<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex h-screen w-full flex-col justify-center bg-black">
	<h1 class="mb-2 text-center text-6xl font-bold text-teal-500">{$page.status}</h1>
	<p class="text-center text-4xl font-semibold text-white">
		{$page.error?.message ?? 'Something When Wrong!'}
	</p>
</div>
