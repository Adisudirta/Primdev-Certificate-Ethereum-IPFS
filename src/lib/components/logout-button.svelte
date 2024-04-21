<script lang="ts">
	import { getAuth, signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';

	import { Button } from '$lib/components/ui/button';
</script>

<Button
	class="w-full"
	variant="destructive"
	on:click={() => {
		const auth = getAuth();

		signOut(auth)
			.then(() => {
				goto('/login');
			})
			.catch((error) => {
				console.error(error);
			});
	}}
>
	Logout
</Button>
