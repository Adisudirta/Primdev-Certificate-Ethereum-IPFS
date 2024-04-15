<script lang="ts">
	import { user } from '$lib/stores/auth';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { initializeApp } from 'firebase/app';
	import { firebaseConfig } from '../config.firebase';

	import '../app.pcss';

	initializeApp(firebaseConfig);

	const auth = getAuth();
	onAuthStateChanged(auth, (userData) => {
		user.set(userData);
	});
</script>

<slot />
