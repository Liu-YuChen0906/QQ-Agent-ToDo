import type { ChatItem, Message, TaskCard } from '@/types/chat'

export interface AgentTaskCardRequest {
  chat: Pick<ChatItem, 'id' | 'name'>
  message: Pick<Message, 'id' | 'senderName' | 'content' | 'timestamp' | 'type'>
}

export interface AgentTaskCardSuccessResponse {
  provider: 'llm' | 'fallback'
  shouldCreateTask: true
  taskCard: TaskCard
}

export interface AgentTaskCardRejectedResponse {
  provider: 'llm' | 'fallback'
  shouldCreateTask: false
  responsePrompt: string
  suggestions: string[]
}

export type AgentTaskCardResponse =
  | AgentTaskCardSuccessResponse
  | AgentTaskCardRejectedResponse
