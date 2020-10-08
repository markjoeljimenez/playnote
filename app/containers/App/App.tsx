import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player/lazy';
import clsx from 'clsx';

import SelectMedia from '../SelectMedia/SelectMedia';
import { Media } from '../SelectMedia/SelectMedia.actions';
import Notes from '../Notes/Notes';
// import Description from '../Description/Description';

const { dialog } = require('electron').remote;

type Props = {
	media: Media;
};

function App({ media }: Props) {
	const playerRef = useRef<ReactPlayer | null>(null);
	const [isError, setIsError] = useState<boolean>();

	useEffect(() => {
		if (isError) {
			dialog.showMessageBox({
				type: 'error',
				message: 'Unable to play video.',
				detail: 'Please check video format or URL.',
			});
		}
	}, [isError]);

	return (
		<div className="min-h-screen flex">
			<div
				className={clsx(
					'flex-1 max-h-screen flex flex-col',
					isError !== undefined && !isError ? 'block' : 'hidden'
				)}
			>
				<div
					className="relative"
					style={{
						paddingTop: `${100 / (1280 / 720)}%`,
					}}
				>
					<ReactPlayer
						className="absolute inset-y-0 inset-x-0"
						url={media?.path}
						controls
						width="100%"
						height="auto"
						ref={playerRef}
						onError={() => {
							setIsError(true);
						}}
						onReady={() => {
							setIsError(false);
						}}
					/>
				</div>
				{/* <Description /> */}
			</div>

			{isError !== undefined && !isError ? (
				<>
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
