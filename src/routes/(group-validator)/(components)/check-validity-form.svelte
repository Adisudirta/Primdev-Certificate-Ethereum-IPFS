<script lang="ts">
	import { zod } from 'sveltekit-superforms/adapters';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { checkValidityFormSchema } from '../(form-schemas)/check-validity-form-schema';
	import { page } from '$app/stores';
	import { latestCertificateCID } from '$lib/stores/certificate';
	import { ethers, toUtf8Bytes } from 'ethers';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { CertificateService } from '$lib/api/services/certificate-service';
	import Swal from 'sweetalert2';

	const initialValueCheckValidityForm = {
		code: '',
		fullName: ''
	};

	const form = superForm(defaults(initialValueCheckValidityForm, zod(checkValidityFormSchema)), {
		SPA: true,
		validators: zod(checkValidityFormSchema),
		validationMethod: 'auto'
	});

	const { form: formData, validateForm, allErrors } = form;

	$: currentCIDOnBlockchain = $page.data.currentCIDOnBlockchain as string | undefined;
	$: currentCID = $latestCertificateCID ?? ($page.data.currentCID as string | null);

	$: isSynchronized = ethers.keccak256(toUtf8Bytes(currentCID!)) === currentCIDOnBlockchain;
</script>

<form
	on:submit|preventDefault={async () => {
		await validateForm({ update: true });

		if (isSynchronized && $allErrors.length === 0) {
			const res = await CertificateService.validateCertificate($formData);

			if (res) {
				Swal.fire({
					icon: 'success',
					title: 'Certificate Valid!'
				});
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Certificate Not Valid!',
					text: 'Invalid certificate code or full name!'
				});
			}
		} else if (!isSynchronized) {
			Swal.fire({
				icon: 'warning',
				title: 'Blockchain Not Synchronized!',
				text: 'Please contact the administrator to synchronize the blockchain!'
			});
		}
	}}
	class="flex flex-col space-y-4"
>
	<Form.Field {form} name="code">
		<Form.Control let:attrs>
			<Form.Label>Code</Form.Label>
			<Input {...attrs} placeholder="Input your certificate code!" bind:value={$formData.code} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="fullName">
		<Form.Control let:attrs>
			<Form.Label>Full Name</Form.Label>
			<Input {...attrs} placeholder="Input your full name!" bind:value={$formData.fullName} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Button
		type="submit"
		class="w-full bg-cyan-500 transition-colors duration-300 ease-in-out hover:bg-cyan-500/65"
	>
		Check Validity
	</Button>
</form>
