import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';
import { ipcRenderer } from 'electron';

import SelectMedia, { Media } from '../SelectMedia/SelectMedia';
import Notes, { Message } from '../Notes/Notes';
import format from '../../scripts/time';
// import { ipcRenderer } from 'electron';

type Props = {
	media: Media;
	notes: Message[];
};

const CHANNEL_NAME = 'main';

function App({ media, notes }: Props) {
	const playerRef = useRef<ReactPlayer | null>(null);
	// const [messages, setMessages] = useState<Message[]>([]);
	// const [notesLoaded, setNotesLoaded] = useState<boolean>(false);

	// useEffect(() => {
	// 	console.log(props);
	// }, [props]);

	// function handleTimestampClick(e: MouseEvent<HTMLButtonElement>) {
	// 	const { value } = e.currentTarget;

	// 	playerRef.current?.seekTo(parseFloat(value) - 1);
	// }

	useEffect(() => {
		if (media) {
			const text = notes.reduce(
				(prev, curr) =>
					// eslint-disable-next-line prefer-template
					prev +
					`[${curr.timeStamp}|${format(curr.timeStamp)}]: ${
						curr.message
					}\r\n`,
				''
			);

			ipcRenderer.send(CHANNEL_NAME, {
				title: media.title,
				// path: media.path.replace(/\.[^/.]+$/, ''),
				text,
			});
		}
	}, [notes]);

	return (
		<div className="h-screen flex">
			{media ? (
				<>
					<div className="flex-1">
						<ReactPlayer
							url={media.path}
							controls
							width="100%"
							ref={playerRef}
						/>
					</div>
					<div className="border-l border-gray-800 w-2/6 flex flex-col">
						<Notes playerRef={playerRef} />
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

function mapStateToProps({ media, notes }: Props) {
	return {
		notes,
		media,
	};
}

export default connect(mapStateToProps)(App);
