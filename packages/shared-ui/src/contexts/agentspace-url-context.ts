import { createContext } from "@lit/context";


export interface AgentspaceFlowContent {
    hideHeader: boolean;
    agentName: string;
    agentInstructions: string;
    agentGoal: string;
    isIframe: boolean;
    parentOrigin: string;
    noCodeAgentId: string;
    engineName: string;
}

// Url context
export const agentspaceUrlContext = createContext<AgentspaceFlowContent>(Symbol('bb-agentsapce-url-context'));
