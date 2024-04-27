export interface CertificateList {
	certificates: Certificate[] | [];
}

export interface Certificate {
	status: 'AVAILABLE' | 'NOT_AVAILABLE';
	eventName: string;
	eventCode: string;
	expired?: number;
	participants?: string[];
}
