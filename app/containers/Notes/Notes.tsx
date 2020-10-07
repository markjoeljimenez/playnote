import { connect } from 'react-redux';
import React, { KeyboardEvent, MouseEvent, useEffect } from 'react';

import setMessagesAction from './Notes.actions';
import format from '../../scripts/time';

export type Message = {
	timeStamp: number;
	message: string;
};

type Props = {
	media: any;
	notes: Message[];
	setMessages: any;
	playerRef: any;
};

function Notes({ media, notes, setMessages, playerRef }: Props) {
	function handleMessageSubmit(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter' && e.currentTarget.value !== '') {
			setMessages([
				...notes,
				{
					timeStamp: playerRef.current?.getCurrentTime() ?? 0,
					message: e.currentTarget.value,
				},
			]);

			e.currentTarget.value = '';
		}
	}

	// useEffect(() => {
	// 	if (media) {
	// 		const text = notes.reduce(
	// 			(prev, curr) =>
	// 				// eslint-disable-next-line prefer-template
	// 				prev +
	// 				`[${curr.timeStamp}|${format(curr.timeStamp)}]: ${
	// 					curr.message
	// 				}\r\n`,
	// 			''
	// 		);

	// 		ipcRenderer.sendSync(CHANNEL_NAME, {
	// 			title: media.title,
	// 			path: media.path,
	// 			text,
	// 		});
	// 	}
	// }, [notes]);

	return (
		<>
			<div className="flex-1 p-4 space-y-3 text-sm overflow-y-scroll">
				{notes?.map(({ timeStamp, message }, i) => (
					<p key={i}>
						<code className="text-gray-600">
							<button
								className="font-semibold hover:text-gray-500"
								type="button"
								// onClick={handleTimestampClick}
								value={timeStamp}
							>
								{`[${format(timeStamp)}]`}
							</button>
							:{' '}
						</code>
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
		</>
	);
}

function mapStateToProps({ notes, media }) {
	return {
		media,
		notes,
	};
}

function mapDispatchToProps(dispatch: any) {
	return {
		setMessages: (messages: Message[]) =>
			dispatch(setMessagesAction(messages)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
