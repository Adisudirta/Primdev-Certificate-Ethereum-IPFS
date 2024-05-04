<script lang="ts">
	import type { Participant } from '$lib/api/models/certificate';

	import { writable } from 'svelte/store';
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { page } from '$app/stores';
	import { addPagination } from 'svelte-headless-table/plugins';

	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import DataNotFound from '../../(components)/data-not-found.svelte';

	const participantsWritable = writable<Participant[] | []>([]);
	$: participantData = ($page.data.participants ?? []) as Participant[] | [];
	$: participantsWritable.set(participantData);

	const table = createTable(participantsWritable, {
		page: addPagination()
	});

	const columns = table.createColumns([
		table.column({
			id: 'name',
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			id: 'email',
			accessor: 'email',
			header: 'Email'
		}),
		table.column({
			id: 'phone',
			accessor: 'phone',
			header: 'Phone'
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
</script>

{#if $participantsWritable.length !== 0}
	<div class="rounded-lg bg-white p-4 shadow-lg">
		<h3 class="mb-4 text-xl font-semibold text-gray-600">Participants</h3>

		<div class="bottom-2 overflow-hidden rounded-md border">
			<Table.Root {...$tableAttrs}>
				<Table.Header>
					{#each $headerRows as headerRow}
						<Subscribe rowAttrs={headerRow.attrs()}>
							<Table.Row>
								{#each headerRow.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
										<Table.Head {...attrs} class="bg-teal-400">
											<div class="text-white">
												<Render of={cell.render()} />
											</div>
										</Table.Head>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				</Table.Header>
				<Table.Body {...$tableBodyAttrs}>
					{#each $pageRows as row (row.id)}
						<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
							<Table.Row {...rowAttrs}>
								{#each row.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs>
										<Table.Cell {...attrs} class="bg-white">
											<Render of={cell.render()} />
										</Table.Cell>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</div>

	<div class="flex items-center justify-end space-x-2 py-4">
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}
		>
			Previous
		</Button>

		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}
		>
			Next
		</Button>
	</div>
{:else}
	<DataNotFound message="No Participants Found" />
{/if}
