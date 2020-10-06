export default function format(value: number) {
	let totalSeconds = value;

	const hours = Math.floor(totalSeconds / 3600)
		.toString()
		.padStart(2, '0');

	totalSeconds %= 3600;

	const minutes = Math.floor(totalSeconds / 60)
		.toString()
		.padStart(2, '0');

	const seconds = Math.floor(totalSeconds % 60)
		.toString()
		.padStart(2, '0');

	return `${hours}:${minutes}:${seconds}`;
}
