import { z } from 'zod';

export const editCertificateFormSchema = z.object({
	eventName: z
		.string()
		.refine((eventName) => eventName.length !== 0, { message: 'Event name is required' }),
	expired: z.string().optional()
});

export type addCertificateFormSchema = typeof editCertificateFormSchema;
