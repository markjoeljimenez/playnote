import React, { useRef, useState, KeyboardEvent } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';

import SelectMedia from '../SelectMedia/SelectMedia';

type Message = {
	timeStamp: string;
	message: string;
};

type Props = {
	media: string;
};

function format(value: number) {
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

function App({ media }: Props) {
	const playerRef = useRef<ReactPlayer | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	function handleMessageSubmit(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter' && e.currentTarget.value !== '') {
			setMessages([
				...messages,
				{
					timeStamp: format(playerRef.current?.getCurrentTime() ?? 0),
					message: e.currentTarget.value,
				},
			]);

			e.currentTarget.value = '';
		}
	}

	return (
		<div className="h-screen flex">
			{media ? (
				<>
					<div className="flex-1">
						<ReactPlayer
							url={media}
							controls
							width="100%"
							ref={playerRef}
						/>
					</div>
					<div className="border-l border-gray-800 w-2/6 flex flex-col">
						<div className="flex-1 p-4 space-y-3 text-sm overflow-y-scroll">
							{messages.map(({ timeStamp, message }, i) => (
								<p key={i}>
									<code className="font-semibold text-gray-600">{`[${timeStamp}]: `}</code>
									<span>{message}</span>
								</p>
							))}
						</div>
						<input
							className="border-t border-gray-800 w-full bg-gray-900 p-4"
							type="text"
							placeholder="Message"
							onKeyDown={handleMessageSubmit}
						/>
					</div>
				</>
			) : (
				<div className="flex-1 items-end justify-center">
					<SelectMedia />
				</div>
			)}
		</div>
	);
}

function mapStateToProps({ media }: Props) {
	return {
		media,
	};
}

export default connect(mapStateToProps)(App);
