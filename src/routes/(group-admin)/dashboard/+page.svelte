<script lang="ts">
	import { user } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator';
	import AddCertificateForm from './(components)/add-certificate-form.svelte';
	import CertificateEventTable from './(components)/certificate-event-table.svelte';

	export let data;

	console.log(data);

	$: !$user && goto('/login');
</script>

<section class="container">
	<h1 class="mb-4 mt-8 text-3xl font-bold text-primary">Dashboard Admin</h1>
	<p class="font-semibold text-gray-500">
		Wellcome Primakara Developer Admin, now you can add & manage certificate here.
	</p>

	<div class="mb-4 mt-10 flex items-center justify-between">
		<Input type="search" placeholder="Search Event" class="max-w-xs" />

		<AddCertificateForm />
	</div>

	<Separator class="mb-5 h-[1px] w-full bg-gray-300" />

	<CertificateEventTable />
</section>
