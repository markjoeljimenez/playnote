import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

import { Media, setMediaActionAndNotesAction } from './SelectMedia.actions';

type Props = {
	setMediaActionAndNotes(media: Media): void;
};

function SelectMedia({ setMediaActionAndNotes }: Props) {
	const urlRef = useRef<HTMLInputElement>(null);

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

	// function handleUrlSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
	// 	if (e.key === 'Enter' && e.currentTarget.value !== '') {
	// 		setMediaActionAndNotes({
	// 			path: e.currentTarget.value,
	// 		});
	// 	}
	// }

	function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		console.log(urlRef.current.value);

		if (urlRef.current?.value) {
			setMediaActionAndNotes({
				path: urlRef.current.value,
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
		<form className="space-y-6 text-center" onSubmit={handleFormSubmit}>
			<label
				className="block border-gray-800 rounded-md border-dashed border-2 text-gray-600 p-5 hover:bg-gray-800 hover:border-gray-700 cursor-pointer"
				htmlFor="selectLocal"
			>
				<p className="font-bold text-xl text-gray-400">Select Media</p>
				<p className="text-xs uppercase font-light tracking-wider mt-1">
					Supported formats: .avi, .mp4
				</p>
				<input
					className="hidden"
					type="file"
					id="selectLocal"
					accept="video/*"
					onChange={handleSelectMedia}
				/>
			</label>
			<p>or</p>
			<label
				className="block border-gray-800 rounded-md border-dashed border-2 text-gray-600 hover:bg-gray-800 hover:border-gray-700 cursor-pointer"
				htmlFor="enterUrl"
			>
				<span className="sr-only">URL</span>
				<input
					ref={urlRef}
					className="bg-transparent p-5"
					id="enterUrl"
					type="url"
					pattern="https://.*"
					required
					// onKeyDown={handleUrlSubmit}
					placeholder="URL"
				/>
			</label>
		</form>
	);
}

function mapDispatchToProps(dispatch: any) {
	return {
		setMediaActionAndNotes: (media: any) =>
			dispatch(setMediaActionAndNotesAction(media)),
	};
}

export default connect(null, mapDispatchToProps)(SelectMedia);
