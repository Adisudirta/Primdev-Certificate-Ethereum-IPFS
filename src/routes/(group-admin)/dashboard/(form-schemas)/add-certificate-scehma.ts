import { z } from 'zod';

export const addCertificateFormSchema = z.object({
	eventName: z
		.string()
		.refine((eventName) => eventName.length !== 0, { message: 'Event name is required' }),
	eventCode: z.string().refine((eventCode) => eventCode.length >= 3, {
		message: 'Event code must be 3 characters long'
	}),
	expired: z.string().optional()
});

export type addCertificateFormSchema = typeof addCertificateFormSchema;
