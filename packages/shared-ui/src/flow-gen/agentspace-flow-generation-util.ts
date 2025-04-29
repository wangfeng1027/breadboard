import type { GraphDescriptor } from "@breadboard-ai/types";

import {
    type AgentspaceFlowContent,
  } from "../contexts/agentspace-url-context.js";

/**
 * The function to update the flow based on agentspace flow content.
 * @param flow 
 * @param content 
 */
export function  updateFlowBasedOnContext(flow: GraphDescriptor, content: AgentspaceFlowContent) {
    const flowName = content.agentName;
    const flowDescription = content.agentGoal;
    const noCodeAgentId = content.noCodeAgentId;
    const engineName = content.engineName;
    if (!!flowName && flow ) {
      flow.title = flowName;
    }
    if (!!flowDescription && flow) {
      flow.description = flowDescription;
    }
    let metadata = flow.metadata;
    if (!metadata) {
      metadata = {}
    }
    if (!!noCodeAgentId && flow) {
        metadata.noCodeAgentId = noCodeAgentId;
    }
    if (!!engineName && flow) {
      metadata.noCodeAgentParent = engineName;
    }
    flow.metadata = metadata;
}
