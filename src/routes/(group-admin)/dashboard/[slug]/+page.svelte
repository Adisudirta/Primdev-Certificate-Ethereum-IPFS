<script lang="ts">
	import { cn } from '$lib/utils/ui';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { user } from '$lib/stores/auth';
	import { dateValidation } from '$lib/utils/date';
	import { appLoading } from '$lib/stores/loading';
	import Swal from 'sweetalert2';

	import { BanIcon, Trash2Icon } from 'lucide-svelte';

	import Slash from 'svelte-radix/Slash.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import ParticipantTable from './(components)/participant-table.svelte';
	import { CertificateService } from '$lib/api/services/certificate-service';
	import EditCertificateForm from './(components)/edit-certificate-form.svelte';
	import AddParticipantForm from './(components)/add-participant-form.svelte';
	import TableLoading from '$lib/components/table-loading.svelte';

	export let data;

	$: !$user && goto('/login');

	$: isRevoked = data.status === 'NOT_AVAILABLE';

	async function handleDeleteEvent() {
		Swal.fire({
			title: 'Are you sure delete this event?',
			showCancelButton: true,
			confirmButtonText: 'Delete'
		}).then(async (result) => {
			if (result.isConfirmed) {
				toast.promise(CertificateService.deleteCertificateEvent(data.eventCode!), {
					loading: 'Deleting event...',
					success: () => {
						goto('/dashboard', { replaceState: true, invalidateAll: true });
						return 'Event deleted successfully';
					},
					error: 'Something went wrong! Please try again!'
				});
			}
		});
	}

	async function handleRevokeEvent() {
		Swal.fire({
			title: 'Are you sure revoke this event?',
			showCancelButton: true,
			confirmButtonText: 'Revoke'
		}).then(async (result) => {
			if (result.isConfirmed) {
				toast.promise(CertificateService.revokeCertificateEvent(data.eventCode!), {
					loading: 'Revoking event...',
					success: () => {
						invalidateAll();
						return 'Event revoked successfully';
					},
					error: 'Something went wrong! Please try again!'
				});
			}
		});
	}
</script>

<section>
	<div class="container">
		<Breadcrumb.Root class="my-8">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href="/dashboard"
						data-sveltekit-preload-data="off"
						class="text-gray-500 transition-colors duration-300 ease-in-out hover:text-teal-500"
					>
						Dashboard
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator>
					<Slash tabindex="-1" />
				</Breadcrumb.Separator>
				<Breadcrumb.Item>
					<Breadcrumb.Page class="text-teal-500">{data?.eventCode?.toUpperCase()}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<div class="mb-8 flex items-center justify-between">
			<!-- Certificate Event Data View -->
			{#if !$appLoading}
				<div class="flex flex-col space-y-4">
					<h1 class=" text-3xl font-bold text-primary">{data?.eventName}</h1>
					<div class="flex items-center space-x-3">
						<div
							class={cn(
								'rounded-lg px-2 py-1',
								data.status === 'AVAILABLE' ? 'bg-teal-500' : 'bg-red-500'
							)}
						>
							<span class="font-semibold text-white">
								{data.status === 'AVAILABLE' ? 'Available' : 'Not Available'}
							</span>
						</div>
						<span class="text-gray-500">|</span>
						<p class="font-semibold text-gray-500">
							Expired on: {dateValidation(data.expired)}
						</p>
					</div>
				</div>
			{:else}
				<div class="flex flex-col space-y-4">
					<div class="h-[36px] w-[362px] animate-pulse rounded bg-teal-300" />

					<div class="flex items-center space-x-3">
						<div class="h-[32px] w-[82px] animate-pulse rounded-lg bg-teal-300" />

						<span class="text-gray-500">|</span>

						<div class="h-[24px] w-[177px] animate-pulse rounded bg-teal-300" />
					</div>
				</div>
			{/if}

			<!-- Buttons -->
			<div class="flex items-center space-x-2">
				<EditCertificateForm disabled={isRevoked} />
				<Button disabled={isRevoked} variant="outline" on:click={handleRevokeEvent}>
					<BanIcon class="mr-1" />
					Revoke
				</Button>
				<Button variant="destructive" on:click={handleDeleteEvent}>
					<Trash2Icon class="mr-1" />
					Delete
				</Button>
				<AddParticipantForm disabled={isRevoked} />
			</div>
		</div>

		<Separator class="mb-5 h-[1px] w-full bg-gray-300" />

		{#if !$appLoading}
			<ParticipantTable />
		{:else}
			<TableLoading />
		{/if}
	</div>
</section>
