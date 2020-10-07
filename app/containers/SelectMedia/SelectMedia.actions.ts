import { ipcRenderer } from 'electron';
import { Message, setMessagesAction } from '../Notes/Notes.actions';

export type Media = {
	title?: string;
	path?: string;
};

export const SET_MEDIA = 'SET_MEDIA';

export function setMediaAction(media: Media) {
	return {
		type: SET_MEDIA,
		media,
	};
}

export function setMediaActionAndNotesAction(media: Media) {
	return (dispatch) => {
		if (media) {
			const content = ipcRenderer.sendSync('GET_NOTES', {
				path: media.path,
			});

			if (content) {
				const transformedContent = content.map((s: string) => {
					const time = s.match(/\[(.*?)\]:/g);
					const message = s.split(time![0])[1].trim();

					return {
						timeStamp: time
							? parseInt(
									time[0]
										.replace(/[[\]']+/g, '')
										.split('|')[0]
							  )
							: undefined,
						message,
					};
				}) as Message[];

				dispatch(setMessagesAction(transformedContent));
			} else {
				dispatch(setMessagesAction([]));
			}
		}

		dispatch(setMediaAction(media));
	};
}
