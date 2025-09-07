import { createContext, useContext, useState, ReactNode } from 'react';

interface WorkspaceContextType {
	workspaceId: string;
	setWorkspaceId: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
	workspaceId: 'default',
	setWorkspaceId: () => {},
});

export function WorkspaceProvider({ children }: { children: ReactNode }) {
	const [workspaceId, setWorkspaceId] = useState('Container 1'); // Set your initial workspace id

	return (
		<WorkspaceContext.Provider value={{ workspaceId, setWorkspaceId }}>
			{children}
		</WorkspaceContext.Provider>
	);
}

export function useWorkspace() {
	return useContext(WorkspaceContext);
}
