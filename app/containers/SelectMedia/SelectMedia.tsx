import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

import { Media, setMediaActionAndNotesAction } from './SelectMedia.actions';

type Props = {
	setMediaActionAndNotes(media: Media): void;
};

function SelectMedia({ setMediaActionAndNotes }: Props) {
	function handleSelectMedia(e: React.ChangeEvent<HTMLInputElement>) {
		const path = e.target.files?.[0].path;
		const title = e.target.files?.[0].name.replace(/\.[^/.]+$/, '');

		if (path && title) {
			setMediaActionAndNotes({
				title,
				path,
			});
		}
	}

	useEffect(() => {
		ipcRenderer.on('OPEN', (event, media) => {
			setMediaActionAndNotes(media);
		});

		return () => {};
	}, []);

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
		setMediaActionAndNotes: (media: any) =>
			dispatch(setMediaActionAndNotesAction(media)),
	};
}

export default connect(null, mapDispatchToProps)(SelectMedia);
