<script lang="ts">
	import { user } from '$lib/stores/auth';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { initializeApp } from 'firebase/app';
	import { firebaseConfig } from '../config.firebase';
	import { MetaMaskStore } from '$lib/stores/metamask';

	import MetamaskProvider from '$lib/components/metamask-provider.svelte';

	import '../app.pcss';
	import { goto } from '$app/navigation';

	initializeApp(firebaseConfig);
	const auth = getAuth();

	onAuthStateChanged(auth, (userData) => {
		if (userData) {
			user.set(userData);
		}
	});

	$: $user && goto('/dashboard');

	const { walletState } = MetaMaskStore();
</script>

<div class="gradient-corner">
	<MetamaskProvider>
		<div class="min-h-[calc(100vh-40px)] w-full">
			<slot />
		</div>

		<footer class="flex h-10 w-full items-center justify-center">
			{#if Boolean($walletState.account)}
				<span>{$walletState.account}</span>
			{/if}
		</footer>
	</MetamaskProvider>
</div>

<style scoped>
	.gradient-corner::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		background-position: top left;
		background-repeat: no-repeat;
		background-size: contain;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='626' height='485' fill='none' %3E%3Cg filter='url(%23a)' %3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M245.045 105.555c48.171-56.282 56.305-142.32 10.558-201.2-39.596-50.965-113.131-28.833-174.524-9.838C26.98-88.743-31.5-62.128-35.33-5.628c-4.127 60.86 43.73 109.705 100.67 132.285 62.164 24.651 136.496 29.384 179.706-21.102Z' fill='url(%23b)' fill-opacity='.6' /%3E%3C/g %3E%3Cdefs %3E%3ClinearGradient id='b' x1='155.256' y1='234.396' x2='-24.121' y2='-182.929' gradientUnits='userSpaceOnUse' %3E%3Cstop stop-color='%231AFFDE' /%3E%3Cstop offset='1' stop-color='%2303fcf0' /%3E%3C/linearGradient %3E%3Cfilter id='a' x='-375.58' y='-466.996' width='1001.47' height='951.618' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB' %3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix' /%3E%3CfeBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' /%3E%3CfeGaussianBlur stdDeviation='170' result='effect1_foregroundBlur_6623_20308' /%3E%3C/filter %3E%3C/defs %3E%3C/svg %3E");
	}
</style>
