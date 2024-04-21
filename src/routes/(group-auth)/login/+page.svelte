<script lang="ts">
	import { zod } from 'sveltekit-superforms/adapters';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { loginFormSchema } from './(form-schemas)/login-schema';
	import { user } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

	import logoPrimdev from '$lib/assets/logo-primaraka-developers.svg';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { FirebaseError } from 'firebase/app';

	$: $user && goto('/dashboard');

	const initialValueLoginForm = {
		email: '',
		password: ''
	};

	const form = superForm(defaults(initialValueLoginForm, zod(loginFormSchema)), {
		SPA: true,
		validators: zod(loginFormSchema),
		validationMethod: 'auto'
	});

	const { form: formData, validateForm, allErrors, errors } = form;

	let isLoading = false;
	async function handleLogin() {
		isLoading = true;
		const auth = getAuth();
		await signInWithEmailAndPassword(auth, $formData.email, $formData.password)
			.then((userCredential) => {
				isLoading = false;
				const userData = userCredential.user;
				user.set(userData);
				goto('/dashboard');
			})
			.catch((error) => {
				isLoading = false;

				if (error instanceof FirebaseError) {
					const errorMessage = error.message;

					console.log(error.code);
					switch (error.code) {
						case 'auth/invalid-credential':
							$errors.email = ['Invalid credential!'];
							$errors.password = ['Invalid Credential!'];
							break;
						case 'auth/too-many-requests':
							$errors.password = ['Too many requests!'];
							break;
						default:
							$errors.password = [errorMessage];
					}
				}
			});
	}
</script>

<section class="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
	<div class="flex flex-col items-center justify-center gap-5">
		<img src={logoPrimdev} class="w-[300px] object-contain" alt="Primakara Developer Logo" />

		<h1 class="text-center text-2xl font-bold text-blue-500">
			Wellcome Primakara Developer Admin!
		</h1>

		<div class="w-[500px]">
			<form
				on:submit={async (e) => {
					e.preventDefault();
					await validateForm({ update: true });

					if ($allErrors.length === 0) {
						await handleLogin();
					}
				}}
				class="flex flex-col space-y-4"
			>
				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} placeholder="Input your email" bind:value={$formData.email} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Password</Form.Label>
						<Input
							{...attrs}
							type="password"
							placeholder="Input your password!"
							bind:value={$formData.password}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Button
					type="submit"
					class="w-full bg-cyan-500 transition-colors duration-300 ease-in-out hover:bg-cyan-500/65"
				>
					{isLoading ? 'Loading...' : 'Login'}
				</Button>
			</form>
		</div>
	</div>
</section>
