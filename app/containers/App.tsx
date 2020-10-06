import React, { ReactNode } from 'react';

type Props = {
	children: ReactNode;
};

export default function App({ children }: Props) {
	return <>{children}</>;
}
