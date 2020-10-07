import React, { useRef } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player/lazy';

import SelectMedia from '../SelectMedia/SelectMedia';
import Notes from '../Notes/Notes';
import { Media } from '../SelectMedia/SelectMedia.actions';

type Props = {
	media: Media;
};

function App({ media }: Props) {
	const playerRef = useRef<ReactPlayer | null>(null);

	return (
		<div className="h-screen flex">
			{media ? (
				<>
					<div className="flex-1">
						<ReactPlayer
							url={media.path}
							controls
							width="100%"
							height="auto"
							ref={playerRef}
						/>
						<div className="p-4 px-6">
							<h1 className="text-2xl">{media.title}</h1>
						</div>
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

function mapStateToProps({ media }: Props) {
	return {
		media,
	};
}

export default connect(mapStateToProps)(App);
