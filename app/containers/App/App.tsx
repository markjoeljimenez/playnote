import React, { useRef } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player/lazy';

import SelectMedia from '../SelectMedia/SelectMedia';
import { Media } from '../SelectMedia/SelectMedia.actions';
import Notes from '../Notes/Notes';

type Props = {
	media: Media;
};

function App({ media }: Props) {
	const playerRef = useRef<ReactPlayer | null>(null);

	return (
		<div className="min-h-screen flex">
			{media ? (
				<>
					<div className="flex-1 max-h-screen flex flex-col">
						<ReactPlayer
							url={media.path}
							controls
							width="100%"
							height="auto"
							ref={playerRef}
						/>
						<div className="p-12 py-10 space-y-6 max-w-4xl mx-auto overflow-y-auto">
							<div className="text-gray-200">
								<h1 className="text-3xl font-bold">
									{media.title}
								</h1>
								<h2 className="text-lg mt-2">
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit. Vivamus blandit vehicula
									molestie. Quisque nec odio ac dolor dapibus
									sagittis vel eget urna. Morbi nisi est,
								</h2>
								<div className="border-b border-gray-300 mt-6 w-16" />
							</div>
							<div className="prose text-gray-500">
								<p>
									Praesent tempus tristique tellus non auctor.
									Pellentesque vitae vestibulum augue. Fusce
									id lacus porttitor erat suscipit malesuada.
									Fusce eu justo turpis.
								</p>
								<ul>
									<li>
										Ut semper facilisis ipsum non
										pellentesque. Sed vitae scelerisque
										nibh. Nam sollicitudin purus quam. Nam
										eget quam vestibulum, lacinia justo ac
									</li>
									<li>
										Ut semper facilisis ipsum non
										pellentesque. Sed vitae scelerisque
										nibh. Nam sollicitudin purus quam. Nam
										eget quam vestibulum, lacinia justo ac
									</li>
									<li>
										Ut semper facilisis ipsum non
										pellentesque. Sed vitae scelerisque
										nibh. Nam sollicitudin purus quam. Nam
										eget quam vestibulum, lacinia justo ac
									</li>
								</ul>
							</div>
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
