import React from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

import setMediaAction, { Media } from './SelectMedia.actions';
import { setMessagesAction } from '../Notes/Notes.actions';
import { Message } from '../Notes/Notes';

type Props = {
	setMedia(media: Media): void;
	setMessages(messages: Message[]): void;
};

function SelectMedia({ setMedia, setMessages }: Props) {
	function handleSelectMedia(e: React.ChangeEvent<HTMLInputElement>) {
		const path = e.target.files?.[0].path;
		const title = e.target.files?.[0].name.replace(/\.[^/.]+$/, '');

		if (path && title) {
			setMedia({
				title,
				path,
			});

			const content = ipcRenderer.sendSync('GET_NOTES', {
				path,
			});

			const transformedContent = content.map((s: string) => {
				const time = s.match(/\[(.*?)\]:/g);
				const message = s.split(time![0])[1].trim();

				return {
					timeStamp: time
						? parseInt(
								time[0].replace(/[[\]']+/g, '').split('|')[0]
						  )
						: undefined,
					message,
				};
			}) as Message[];

			setMessages(transformedContent);
		}
	}

	return (
		<input
			type="file"
			className="border-gray-800 rounded-md border-dashed border-2 text-gray-600 p-5 hover:bg-gray-800 hover:border-gray-700 cursor-pointer"
			id="avatar"
			name="avatar"
			accept="video/*"
			onChange={handleSelectMedia}
		/>
		// <p className="font-bold text-xl text-gray-400">Select Media</p>
		// <span className="text-xs uppercase font-light tracking-wider">
		// 	Supported formats: .avi, .mp4
		// </span>
	);
}

function mapDispatchToProps(dispatch: any) {
	return {
		setMedia: (media: any) => dispatch(setMediaAction(media)),
		setMessages: (messages: Message[]) =>
			dispatch(setMessagesAction(messages)),
	};
}

export default connect(null, mapDispatchToProps)(SelectMedia);
