<script lang="ts">
	import { page } from '$app/stores';
	import { zod } from 'sveltekit-superforms/adapters';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { addParticipantFormSchema } from '../(from-schemas)/add-participant-schema';
	import { CertificateService } from '$lib/api/services/certificate-service';

	import { CirclePlus } from 'lucide-svelte';
	import FormDialog from '$lib/components/form-dialog.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Trigger } from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	export let disabled = false;

	let isLoading = false;
	let isFormDialogOpen = false;

	const initialValueAddParticipantForm = {
		name: '',
		email: '',
		role: '',
		phone: '',
		address: ''
	};

	const form = superForm(defaults(initialValueAddParticipantForm, zod(addParticipantFormSchema)), {
		SPA: true,
		validators: zod(addParticipantFormSchema),
		validationMethod: 'auto'
	});

	const { form: formData, validateForm, allErrors } = form;

	async function createParticipant(participantData: {
		name: string;
		email: string;
		phone: string;
	}) {
		toast.promise(
			async () => {
				isLoading = true;
				await CertificateService.addParticipantToCertificateEvent(
					$page.data.eventCode,
					participantData
				);
				isLoading = false;
				isFormDialogOpen = false;
				invalidateAll();
			},
			{
				loading: 'Adding participant...',
				success: () => {
					invalidateAll();
					return 'Participant added successfully';
				},
				error: 'Something went wrong! Please try again!'
			}
		);
	}
</script>

<FormDialog bind:open={isFormDialogOpen} title="Add Participant">
	<div slot="trigger">
		<Trigger
			{disabled}
			class={buttonVariants({ variant: 'default' })}
			on:click={() => (isFormDialogOpen = true)}
		>
			<CirclePlus class="mr-1" />
			Add Participant
		</Trigger>
	</div>

	<div slot="content">
		<form
			on:submit|preventDefault={async () => {
				await validateForm();
				if ($allErrors.length === 0) {
					await createParticipant({
						name: $formData.name,
						email: $formData.email,
						phone: $formData.phone
					});
				}
			}}
			class="flex flex-col space-y-4"
		>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Participant Name</Form.Label>
					<Input {...attrs} placeholder="Input participant name" bind:value={$formData.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input
						{...attrs}
						type="email"
						placeholder="Input participant email"
						bind:value={$formData.email}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="phone">
				<Form.Control let:attrs>
					<Form.Label>Phone</Form.Label>
					<Input
						{...attrs}
						type="tel"
						placeholder="Input participant phone number"
						bind:value={$formData.phone}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Button
				type="submit"
				disabled={isLoading ||
					$allErrors.length > 0 ||
					$formData.name === '' ||
					$formData.email === '' ||
					$formData.phone === ''}
				class="w-full bg-cyan-500 transition-colors duration-300 ease-in-out hover:bg-cyan-500/65"
			>
				{isLoading ? 'Loading...' : 'Add Participant'}
			</Button>
		</form>
	</div>
</FormDialog>
