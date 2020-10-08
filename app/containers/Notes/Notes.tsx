import { connect } from 'react-redux';
import React, {
	KeyboardEvent,
	MouseEvent,
	useEffect,
	useRef,
	useState,
} from 'react';
import { ipcRenderer } from 'electron';
import ReactPlayer from 'react-player';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import clsx from 'clsx';

import {
	deleteMessageAction,
	setMessagesAction,
	editMessageAction,
	saveMessagesAction,
	Message,
} from './Notes.actions';
import format from '../../scripts/time';
import { Media } from '../SelectMedia/SelectMedia.actions';

type Props = {
	media: Media;
	notes: {
		messages: Message[];
		saved: boolean;
	};
	setMessages(messages: Message[], saved: boolean): void;
	editMessage(message: number, text?: string): void;
	deleteMessage(message: number): void;
	saveMessages(saved: boolean): void;
	playerRef: React.MutableRefObject<ReactPlayer | null>;
};

const CHANNEL_NAME = 'main';

function Notes({
	media,
	notes,
	setMessages,
	editMessage,
	deleteMessage,
	saveMessages,
	playerRef,
}: Props) {
	const [isSorted, setIsSorted] = useState<boolean>();
	const messageRefs = useRef<(HTMLElement | null)[]>([]);
	const notesContainerRef = useRef<HTMLUListElement>(null);

	let editedMessage: string;

	function handleMessageSubmit(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter' && e.currentTarget.value !== '') {
			setMessages(
				[
					...notes.messages,
					{
						timeStamp: playerRef.current?.getCurrentTime() ?? 0,
						message: e.currentTarget.value,
					},
				],
				false
			);

			e.currentTarget.value = '';
		}
	}

	function handleTimestampClick(e: MouseEvent<HTMLButtonElement>) {
		const { value } = e.currentTarget;

		playerRef.current?.seekTo(parseFloat(value) - 1);
	}

	function handleDeleteMessage(e: MouseEvent<HTMLButtonElement>) {
		const { value } = e.currentTarget;

		deleteMessage(parseInt(value));
	}

	function handleEditMessage(e: ContentEditableEvent) {
		const { value } = e.target;

		editedMessage = value;
	}

	function handleSortClick(e: MouseEvent<HTMLButtonElement>) {
		setIsSorted(!isSorted);
	}

	// Init refs
	useEffect(() => {
		messageRefs.current = messageRefs.current.slice(
			0,
			notes?.messages.length
		);

		ipcRenderer.on('SAVED', (event, saved) => {
			saveMessages(saved);
		});

		return () => {};
	}, []);

	// Update notes and send to IPCMAIN
	useEffect(() => {
		if (media) {
			const text = notes.messages.reduce(
				(prev, curr) =>
					// eslint-disable-next-line prefer-template
					prev +
					`[${curr.timeStamp}|${format(curr.timeStamp)}]: ${
						curr.message
					}\r\n`,
				''
			);

			ipcRenderer.send(CHANNEL_NAME, notes.saved, {
				title: media.title,
				text,
			});
		}

		// Always scroll notesContainer to bottom
		if (notesContainerRef.current) {
			notesContainerRef.current.scrollTop =
				notesContainerRef.current?.scrollHeight;
		}

		return () => {};
	}, [notes]);

	return (
		<div className="flex-1 flex flex-col justify-between h-screen">
			<div
				className={clsx(
					'flex items-baseline p-4 pl-6 border-b border-gray-800',
					notes.saved !== undefined
						? 'justify-between'
						: 'justify-end'
				)}
			>
				{/* eslint-disable-next-line no-nested-ternary */}
				{notes.saved !== undefined ? (
					notes.saved ? (
						<p className="text-gray-600">Saved</p>
					) : (
						<p className="text-gray-300">Unsaved</p>
					)
				) : (
					<></>
				)}
				<button
					className="hover:bg-gray-700 text-white font-bold py-2 px-4 rounded border border-gray-700"
					type="button"
					onClick={handleSortClick}
				>
					Sort
					{/* eslint-disable-next-line no-nested-ternary */}
					{isSorted !== undefined ? (
						isSorted ? (
							<svg
								className="inline fill-current -mr-2"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								width="24"
								height="24"
							>
								<g data-name="Layer 2">
									<g data-name="chevron-down">
										<rect
											width="24"
											height="24"
											opacity="0"
										/>
										<path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z" />
									</g>
								</g>
							</svg>
						) : (
							<svg
								className="inline fill-current -mr-2"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								width="24"
								height="24"
							>
								<g data-name="Layer 2">
									<g data-name="chevron-up">
										<rect
											width="24"
											height="24"
											transform="rotate(180 12 12)"
											opacity="0"
										/>
										<path d="M16 14.5a1 1 0 0 1-.71-.29L12 10.9l-3.3 3.18a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.42l4-3.86a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.42 1 1 0 0 1-.69.28z" />
									</g>
								</g>
							</svg>
						)
					) : (
						<></>
					)}
				</button>
			</div>
			<ul
				className="flex-1 text-sm overflow-y-auto"
				ref={notesContainerRef}
			>
				{[...notes.messages]
					.sort((a, b) =>
						// eslint-disable-next-line no-nested-ternary
						isSorted !== undefined
							? isSorted
								? a.timeStamp - b.timeStamp
								: b.timeStamp - a.timeStamp
							: 0
					)
					.map(({ timeStamp, message }, i) => (
						<li
							className="py-2 px-6 pr-12 hover:bg-gray-800 relative group"
							key={i}
						>
							<code className="text-gray-600">
								<button
									className="font-semibold hover:text-gray-500"
									type="button"
									onClick={handleTimestampClick}
									value={timeStamp}
								>
									{`[${format(timeStamp)}]`}
								</button>
								:{' '}
							</code>

							<ContentEditable
								innerRef={(ref: any) => {
									messageRefs.current[i] = ref;
								}}
								html={message}
								className="inline w-full focus:shadow-outline"
								onChange={handleEditMessage}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();

										const index = messageRefs.current.findIndex(
											(el) => el === e.currentTarget
										);

										editMessage(index, editedMessage);

										e.currentTarget.blur();
									}
								}}
							/>

							<div className="absolute inset-y-0 right-0 flex items-center pr-3">
								<button
									className="hidden group-hover:block"
									type="button"
									value={i}
									onClick={handleDeleteMessage}
								>
									<svg
										className="fill-current"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										width="24"
										height="24"
									>
										<g data-name="Layer 2">
											<g data-name="close">
												<rect
													width="24"
													height="24"
													transform="rotate(180 12 12)"
													opacity="0"
												/>
												<path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" />
											</g>
										</g>
									</svg>
								</button>
							</div>
						</li>
					))}
			</ul>
			<input
				className="border-t border-gray-800 w-full bg-gray-900 p-4"
				type="text"
				placeholder="Message"
				onKeyDown={handleMessageSubmit}
			/>
		</div>
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
		setMessages: (messages: Message[], saved: boolean) =>
			dispatch(setMessagesAction(messages, saved)),
		editMessage: (message: number, text?: string) =>
			dispatch(editMessageAction(message, text)),
		deleteMessage: (message: number) =>
			dispatch(deleteMessageAction(message)),
		saveMessages: (saved: boolean) => dispatch(saveMessagesAction(saved)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
