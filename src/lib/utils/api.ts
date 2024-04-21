import ky from 'ky';
import { env } from '$env/dynamic/public';

export const pinataAPI = ky.create({
	prefixUrl: env.PUBLIC_PINATA_BASE_URL,
	headers: {
		Authorization: `Bearer ${env.PUBLIC_PINATA_JWT}`
	}
});
