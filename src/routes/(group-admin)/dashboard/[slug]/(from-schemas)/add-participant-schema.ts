import { z } from 'zod';

export const addParticipantFormSchema = z.object({
	name: z.string().refine((eventName) => eventName.length !== 0, { message: 'Name is required' }),
	email: z
		.string()
		.email({ message: 'Invalid email' })
		.refine((email) => email.length !== 0, { message: 'Email is required' }),
	phone: z
		.string()
		.refine((phone) => phone.length !== 0, { message: 'Phone is required' })
		.refine((phone) => /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone), { message: 'Invalid phone number' })
});
