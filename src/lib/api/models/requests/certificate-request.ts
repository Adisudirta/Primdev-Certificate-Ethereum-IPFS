export type CreateEventRequest = {
	status: 'AVAILABLE' | 'NOT_AVAILABLE';
	eventName: string;
	eventCode: string;
	expired?: number;
};
