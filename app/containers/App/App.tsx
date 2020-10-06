import React, {
	useRef,
	useState,
	KeyboardEvent,
	MouseEvent,
	useEffect,
} from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';

import SelectMedia from '../SelectMedia/SelectMedia';
import Notes from '../Notes/Notes';
import format from '../../scripts/time';

type Message = {
	timeStamp: number;
	message: string;
};

type Props = {
	media: string;
};

const CHANNEL_NAME = 'main';

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

		playerRef.current?.seekTo(parseFloat(value) - 1);
	}

	useEffect(() => {
		const parsedText = messages.reduce(
			(prev, curr) =>
				// eslint-disable-next-line prefer-template
				prev +
				`[${curr.timeStamp}|${format(curr.timeStamp)}]: ${
					curr.message
				}\r\n`,
			''
		);

		ipcRenderer.send(CHANNEL_NAME, parsedText);
	}, [messages]);

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
						<Notes
							messages={messages}
							handleTimestampClick={handleTimestampClick}
							handleMessageSubmit={handleMessageSubmit}
						/>
					</div>
				</>
			) : (
				<div className="flex-1 flex items-center justify-center">
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
