<script lang="ts">
	import { zod } from 'sveltekit-superforms/adapters';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { loginFormSchema } from './(form-schemas)/login-schema';
	import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

	import logoPrimdev from '$lib/assets/logo-primaraka-developers.svg';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { user } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	const initialValueLoginForm = {
		email: '',
		password: ''
	};

	const form = superForm(defaults(initialValueLoginForm, zod(loginFormSchema)), {
		SPA: true,
		validators: zod(loginFormSchema),
		validationMethod: 'auto'
	});

	const { form: formData, validateForm, allErrors } = form;

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
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error(errorCode, errorMessage);
			});
	}
</script>

<section
	class="gradient-corner relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
>
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

<style scoped>
	.gradient-corner::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 1200px;
		height: 1200px;
		z-index: -1;
		background-position: top left;
		background-repeat: no-repeat;
		background-size: contain;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='626' height='485' fill='none' %3E%3Cg filter='url(%23a)' %3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M245.045 105.555c48.171-56.282 56.305-142.32 10.558-201.2-39.596-50.965-113.131-28.833-174.524-9.838C26.98-88.743-31.5-62.128-35.33-5.628c-4.127 60.86 43.73 109.705 100.67 132.285 62.164 24.651 136.496 29.384 179.706-21.102Z' fill='url(%23b)' fill-opacity='.6' /%3E%3C/g %3E%3Cdefs %3E%3ClinearGradient id='b' x1='155.256' y1='234.396' x2='-24.121' y2='-182.929' gradientUnits='userSpaceOnUse' %3E%3Cstop stop-color='%231AFFDE' /%3E%3Cstop offset='1' stop-color='%2303fcf0' /%3E%3C/linearGradient %3E%3Cfilter id='a' x='-375.58' y='-466.996' width='1001.47' height='951.618' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB' %3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix' /%3E%3CfeBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' /%3E%3CfeGaussianBlur stdDeviation='170' result='effect1_foregroundBlur_6623_20308' /%3E%3C/filter %3E%3C/defs %3E%3C/svg %3E");
	}
</style>
