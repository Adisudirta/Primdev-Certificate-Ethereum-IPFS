<script lang="ts">
	import FormDialog from '$lib/components/form-dialog.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { addCertificateFormSchema } from '../(form-schemas)/add-certificate-scehma';

	let isLoading = false;

	const initialValueAddCertificateForm = {
		eventName: '',
		eventCode: '',
		eventDate: undefined
	};

	const form = superForm(defaults(initialValueAddCertificateForm, zod(addCertificateFormSchema)), {
		SPA: true,
		validators: zod(addCertificateFormSchema),
		validationMethod: 'auto'
	});

	const { form: formData, validateForm, allErrors } = form;
</script>

<FormDialog triggerText="Add Event" title="Add Certificate Event">
	<form
		on:submit={async (e) => {
			e.preventDefault();
			await validateForm({ update: true });
		}}
		class="flex flex-col space-y-4"
	>
		<Form.Field {form} name="eventName">
			<Form.Control let:attrs>
				<Form.Label>Event Name</Form.Label>
				<Input {...attrs} placeholder="Input event name" bind:value={$formData.eventName} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="eventCode">
			<Form.Control let:attrs>
				<Form.Label>Event Code</Form.Label>
				<Input {...attrs} placeholder="Input event code" bind:value={$formData.eventCode} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="eventCode">
			<Form.Control let:attrs>
				<Form.Label>Event Code</Form.Label>
				<Input {...attrs} placeholder="Input event code" bind:value={$formData.eventCode} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Button
			type="submit"
			disabled={isLoading ||
				$allErrors.length > 0 ||
				$formData.eventCode === '' ||
				$formData.eventName === ''}
			class="w-full bg-cyan-500 transition-colors duration-300 ease-in-out hover:bg-cyan-500/65"
		>
			{isLoading ? 'Loading...' : 'Add Certificate Event'}
		</Button>
	</form>
</FormDialog>
