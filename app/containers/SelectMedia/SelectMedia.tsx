import React from 'react';
import { connect } from 'react-redux';

import setMedia from './SelectMedia.actions';

type Props = {
	setMedia(s: string): void;
};

function SelectMedia(props: Props) {
	function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		console.log(e.currentTarget.value);
		props.setMedia('C:\\Users\\Mark Jimenez\\Downloads\\1.mp4');
	}

	return (
		<input
			type="file"
			className="border-gray-800 rounded-md border-dashed border-2 text-gray-600 p-5 hover:bg-gray-800 hover:border-gray-700"
			id="avatar"
			name="avatar"
			// accept="image/png, image/jpeg"
			onChange={handleUpload}
		/>
		// <p className="font-bold text-xl text-gray-400">Select Media</p>
		// <span className="text-xs uppercase font-light tracking-wider">
		// 	Supported formats: .avi, .mp4
		// </span>
	);
}

function mapDispatchToProps(dispatch: any) {
	return {
		setMedia: (media: any) => dispatch(setMedia(media)),
	};
}

export default connect(null, mapDispatchToProps)(SelectMedia);
