import React, { KeyboardEvent, MouseEvent } from 'react';
import format from '../../scripts/time';

type Message = {
	timeStamp: number;
	message: string;
};

type Props = {
	messages: Message[];
	handleTimestampClick(e: MouseEvent<HTMLButtonElement>): void;
	handleMessageSubmit(e: KeyboardEvent<HTMLInputElement>): void;
};

export default function Notes({
	messages,
	handleTimestampClick,
	handleMessageSubmit,
}: Props) {
	return (
		<>
			<div className="flex-1 p-4 space-y-3 text-sm overflow-y-scroll">
				{messages.map(({ timeStamp, message }, i) => (
					<p key={i}>
						<button
							className="font-semibold text-gray-600 hover:text-gray-500"
							type="button"
							onClick={handleTimestampClick}
							value={timeStamp}
						>
							<code>{`[${format(timeStamp)}]: `}</code>
						</button>
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
