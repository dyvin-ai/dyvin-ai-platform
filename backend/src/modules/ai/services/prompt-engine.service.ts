import { Injectable } from '@nestjs/common';
import { ChatMessage } from '../providers/base-ai-provider.interface';

export interface PromptBuildParams {
  systemPrompt: string;
  developerPrompt?: string;
  userPrompt: string;
  knowledgeGraphContext?: Record<string, any>;
  outputSchema?: Record<string, any>;
}

@Injectable()
export class PromptEngine {
  buildMessages(params: PromptBuildParams): ChatMessage[] {
    const messages: ChatMessage[] = [];

    // 1. System Prompt
    messages.push({
      role: 'system',
      content: params.systemPrompt,
    });

    // 2. Developer Prompt & Knowledge Graph Context Injection
    if (params.developerPrompt || params.knowledgeGraphContext) {
      let devContent = params.developerPrompt || '';
      if (params.knowledgeGraphContext) {
        devContent += `\n\n[INJECTED KNOWLEDGE GRAPH CONTEXT]:\n${JSON.stringify(params.knowledgeGraphContext, null, 2)}`;
      }
      messages.push({
        role: 'developer',
        content: devContent.trim(),
      });
    }

    // 3. User Prompt & Output Schema Injection
    let userContent = params.userPrompt;
    if (params.outputSchema) {
      userContent += `\n\nReturn response ONLY as valid JSON matching this schema:\n${JSON.stringify(params.outputSchema, null, 2)}`;
    }

    messages.push({
      role: 'user',
      content: userContent,
    });

    return messages;
  }
}
