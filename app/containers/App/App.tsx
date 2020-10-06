import React, { useRef, useState, KeyboardEvent, MouseEvent } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';

import format from '../../scripts/time';

import SelectMedia from '../SelectMedia/SelectMedia';

type Message = {
	timeStamp: number;
	message: string;
};

type Props = {
	media: string;
};

function App({ media }: Props) {
	const playerRef = useRef<ReactPlayer | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	function handleMessageSubmit(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter' && e.currentTarget.value !== '') {
			setMessages([
				...messages,
				{
					timeStamp: playerRef.current?.getCurrentTime() ?? 0,
					message: e.currentTarget.value,
				},
			]);

			e.currentTarget.value = '';
		}
	}

	function handleTimestampClick(e: MouseEvent<HTMLButtonElement>) {
		const { value } = e.currentTarget;

		playerRef.current?.seekTo(parseFloat(value));
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
									<button
										className="font-semibold text-gray-600 hover:text-gray-500"
										type="button"
										onClick={handleTimestampClick}
										value={timeStamp}
									>
										<code>{`[${format(
											timeStamp
										)}]: `}</code>
									</button>
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
