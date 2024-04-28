<script lang="ts">
	import type { Certificate } from '$lib/api/models/certificate';
	import moment from 'moment';
	import { writable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Table from '$lib/components/ui/table';
	import ActionButton from '$lib/components/action-button.svelte';
	import DataNotFound from './data-not-found.svelte';

	export let certificateEventData: Certificate[] | [];

	let searchValue: string;
	const certificateEventWritable = writable<Certificate[] | []>([]);

	$: searchValue
		? certificateEventWritable.set(
				certificateEventData.filter((certificate) =>
					certificate.eventName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
				) ?? []
			)
		: certificateEventWritable.set(certificateEventData);

	const table = createTable(certificateEventWritable);

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
			header: 'Amount',
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

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
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
	{:else}
		<DataNotFound />
	{/if}
</div>
