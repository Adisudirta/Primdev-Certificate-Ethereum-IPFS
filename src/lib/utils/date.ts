import moment from 'moment';

export function dateValidation(date: string | undefined): string {
	if (date) {
		const isExpired = moment(date).isBefore(moment());
		if (isExpired) {
			return 'Expired';
		} else {
			return moment(date).format('DD MMMM YYYY');
		}
	} else {
		return 'No Expired Date';
	}
}
