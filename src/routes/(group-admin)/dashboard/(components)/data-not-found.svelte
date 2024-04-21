<script lang="ts">
	import noData from '$lib/assets/no-data.svg';
</script>

<div class="flex h-[500px] w-full flex-col items-center justify-center space-y-3">
	<img class="w-[200px] object-contain" src={noData} alt="No Data Illustration" />

	<div class="text-center">
		<h1 class="mb-1 text-3xl font-bold text-primary">Data Not Found</h1>
		<p class="mb-4 text-gray-500">Event doesn't exist</p>
	</div>
</div>
