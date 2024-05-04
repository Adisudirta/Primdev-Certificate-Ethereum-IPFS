<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/auth';
	import { dateValidation } from '$lib/utils/date';

	import { FilePenLineIcon, BanIcon, Trash2Icon, CirclePlus } from 'lucide-svelte';

	import Slash from 'svelte-radix/Slash.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import ParticipantTable from '../(components)/participant-table.svelte';
	import { toast } from 'svelte-sonner';

	export let data;

	$: !$user && goto('/login');
</script>

<section>
	<div class="container">
		<Breadcrumb.Root class="my-8">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href="/dashboard"
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
			<div class="flex flex-col space-y-4">
				<h1 class=" text-3xl font-bold text-primary">{data?.eventName}</h1>
				<div class="flex items-center space-x-3">
					<div class="rounded-lg bg-teal-500 px-1 py-0.5">
						<span class="text-[11px] font-semibold text-white">
							{data?.eventCode?.toUpperCase()}
						</span>
					</div>
					<span class="text-gray-500">|</span>
					<p class="font-semibold text-gray-500">
						{dateValidation(data.expired)}
					</p>
				</div>
			</div>

			<div class="flex items-center space-x-2">
				<Button variant="secondary" on:click={() => toast('test sonner')}>
					<FilePenLineIcon class="mr-1" /> Edit
				</Button>
				<Button variant="outline">
					<BanIcon class="mr-1" />
					Revoke
				</Button>
				<Button variant="destructive">
					<Trash2Icon class="mr-1" />
					Delete
				</Button>
				<Button>
					<CirclePlus class="mr-1" />
					Add Participant
				</Button>
			</div>
		</div>

		<Separator class="mb-5 h-[1px] w-full bg-gray-300" />

		<ParticipantTable />
	</div>
</section>
