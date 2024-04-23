<script lang="ts">
	import AddCertificateForm from './add-certificate-form.svelte';

	import noData from '$lib/assets/no-data.svg';
</script>

<div class="flex h-[500px] w-full flex-col items-center justify-center space-y-3">
	<img class="w-[200px] object-contain" src={noData} alt="No Data Illustration" />

	<div class="text-center">
		<h1 class="mb-1 text-3xl font-bold text-primary">No Event Yet</h1>
		<p class="mb-4 text-gray-500">Create your first event now</p>

		<AddCertificateForm />
	</div>
</div>
