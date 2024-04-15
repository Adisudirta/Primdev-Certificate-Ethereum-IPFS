import { z } from 'zod';

export const loginFormSchema = z
	.object({
		email: z.string().email({ message: 'Invalid email address' }),
		password: z
			.string()
			.refine((value) => !(value.length <= 8), { message: 'Password must be 8 characters long' })
	})
	.required();

export type loginFormSchema = typeof loginFormSchema;
