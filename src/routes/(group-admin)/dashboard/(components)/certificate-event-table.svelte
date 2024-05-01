<script lang="ts">
	import type { Certificate } from '$lib/api/models/certificate';

	import moment from 'moment';
	import { writable } from 'svelte/store';

	import * as Table from '$lib/components/ui/table';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination } from 'svelte-headless-table/plugins';
	import { Input } from '$lib/components/ui/input/index.js';
	import ActionButton from '$lib/components/action-button.svelte';
	import DataNotFound from './data-not-found.svelte';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';

	$: certificateEventData = ($page.data.certificateEvents?.certificates ?? []) as
		| Certificate[]
		| [];

	let searchValue: string;
	const certificateEventWritable = writable<Certificate[] | []>([]);

	$: searchValue
		? certificateEventWritable.set(
				certificateEventData.filter((certificate) =>
					certificate.eventName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
				) ?? []
			)
		: certificateEventWritable.set(certificateEventData);

	const table = createTable(certificateEventWritable, {
		page: addPagination()
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'eventCode',
			header: 'Event Code'
		}),
		table.column({
			accessor: 'eventName',
			header: 'Event Name'
		}),
		table.column({
			id: 'status',
			accessor: ({ status }) => status,
			header: 'Status',
			cell: ({ value }) => {
				return String(value) === 'AVAILABLE' ? 'Available' : 'Not Available';
			}
		}),
		table.column({
			id: 'expired',
			accessor: ({ expired }) => expired,
			header: 'Expired',
			cell: ({ value }) => {
				return value ? moment(value).format('DD MMMM YYYY') : 'No Expired Date';
			}
		}),
		table.column({
			id: 'action',
			accessor: ({ eventCode }) => eventCode,
			header: 'Action',
			cell: ({ value }) => {
				return createRender(ActionButton, {
					contentType: 'eye-icon',
					// TODO: Will be redirect to detail page
					handler: () => console.log('test click detail:', value)
				});
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
</script>

<div class="relative">
	<Input
		type="search"
		placeholder="Search Event"
		class="absolute left-0 top-[-75px] max-w-xs"
		bind:value={searchValue}
	/>

	{#if $certificateEventWritable.length !== 0}
		<div class="bottom-2 overflow-hidden rounded-md border shadow-lg">
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

		<div class="flex items-center justify-end space-x-2 py-4">
			<Button
				variant="outline"
				size="sm"
				on:click={() => ($pageIndex = $pageIndex - 1)}
				disabled={!$hasPreviousPage}>Previous</Button
			>
			<Button
				variant="outline"
				size="sm"
				disabled={!$hasNextPage}
				on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
			>
		</div>
	{:else}
		<DataNotFound />
	{/if}
</div>
