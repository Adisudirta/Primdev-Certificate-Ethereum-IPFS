<script lang="ts">
	import type { Certificate } from '$lib/api/models/certificate';

	import { zod } from 'sveltekit-superforms/adapters';
	import { cn } from '$lib/utils/ui';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { addCertificateFormSchema } from '../(form-schemas)/add-certificate-scehma';

	import CalendarIcon from 'svelte-radix/Calendar.svelte';

	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import FormDialog from '$lib/components/form-dialog.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { CertificateService } from '$lib/api/services/certificate-service';
	import { invalidateAll } from '$app/navigation';
	import { Trigger } from '$lib/components/ui/dialog';

	let isLoading = false;
	let isFormDialogOpen = false;

	const initialValueAddCertificateForm = {
		eventName: '',
		eventCode: '',
		expired: ''
	};

	const form = superForm(defaults(initialValueAddCertificateForm, zod(addCertificateFormSchema)), {
		SPA: true,
		validators: zod(addCertificateFormSchema),
		validationMethod: 'auto'
	});

	const { form: formData, validateForm, allErrors, errors } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
	let value: DateValue | undefined;
	$: value = $formData.expired ? parseDate($formData.expired) : undefined;
	let placeholder: DateValue = today(getLocalTimeZone());

	async function createCertificateEvent(certificateEvent: Certificate) {
		isLoading = true;
		const currentCertificateData = await CertificateService.getLatestUpdatedCertificateData();

		// Check if event code already exist
		if (
			currentCertificateData?.certificates.some(
				(certificate) => certificate.eventCode === certificateEvent.eventCode
			)
		) {
			$errors.eventCode = ['Event code already exist'];
			isLoading = false;
			return;
		}

		const newCertificateEventData: Certificate = {
			status: certificateEvent.status,
			eventCode: certificateEvent.eventCode,
			eventName: certificateEvent.eventName,
			expired: certificateEvent.expired,
			participants: []
		};

		currentCertificateData?.certificates.push(newCertificateEventData);
		await CertificateService.updateCertificateIPFS(currentCertificateData!);
		invalidateAll();
		isFormDialogOpen = false;
		isLoading = false;
	}
</script>

<FormDialog bind:open={isFormDialogOpen} title="Add Certificate Event">
	<div slot="trigger">
		<Trigger
			on:click={() => (isFormDialogOpen = true)}
			class={buttonVariants({ variant: 'default' })}>Add Event</Trigger
		>
	</div>

	<div slot="content">
		<form
			on:submit={async (e) => {
				e.preventDefault();
				await validateForm({ update: true });

				if ($allErrors.length === 0) {
					await createCertificateEvent({
						status: 'AVAILABLE',
						eventName: $formData.eventName,
						eventCode: $formData.eventCode,
						expired: $formData.expired
					});
				}
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

			<Form.Field {form} name="expired" class="flex flex-col">
				<Form.Control let:attrs>
					<Form.Label>Expired</Form.Label>

					<Popover.Root>
						<Popover.Trigger
							{...attrs}
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'justify-start pl-4 text-left font-normal',
								!value && 'text-muted-foreground'
							)}
						>
							{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
							<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
						</Popover.Trigger>

						<Popover.Content class="w-auto p-0" side="top">
							<Calendar
								{value}
								bind:placeholder
								minValue={today(getLocalTimeZone())}
								calendarLabel="Date of birth"
								initialFocus
								onValueChange={(v) => {
									if (v) {
										$formData.expired = v.toString();
									} else {
										$formData.expired = '';
									}
								}}
							/>
						</Popover.Content>
					</Popover.Root>

					<Form.FieldErrors />
					<input hidden value={$formData.expired} name={attrs.name} />
				</Form.Control>
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
	</div>
</FormDialog>
