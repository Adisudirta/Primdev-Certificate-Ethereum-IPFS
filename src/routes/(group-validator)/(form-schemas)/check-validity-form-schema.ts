import { z } from 'zod';

export const checkValidityFormSchema = z
	.object({
		code: z.string().refine(
			(value) => {
				return !(value.length < 6);
			},
			{
				message: 'Code must be 6 characters long'
			}
		),
		fullName: z
			.string()
			.refine((value) => !(value.length <= 3), { message: 'Full name must be 3 characters long' })
	})
	.required();

export type CheckValidityFormSchema = typeof checkValidityFormSchema;
