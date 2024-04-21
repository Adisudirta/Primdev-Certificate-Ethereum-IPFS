<script lang="ts">
	import metamaskLogo from '$lib/assets/metamask.png';

	import { Button } from './ui/button';
</script>

<div class="w-ful container flex h-screen items-center justify-between">
	<div class="flex flex-col space-y-5">
		<h1 class="text-5xl font-bold text-primary">Looks like you doesn't have Metamask installed</h1>
		<p class="text-xl text-gray-500">
			Sorry about that! Please install Metamask and you can come back here.
		</p>

		<Button
			class="w-fit"
			href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?pli=1"
			target="_blank"
		>
			Take me there!
		</Button>
	</div>

	<img src={metamaskLogo} class="w-[500px] object-contain grayscale" alt="Metamask Logo" />
</div>
