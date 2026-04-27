import type { ChatItem, Message, TaskCard } from '@/types/chat'

export interface AgentTaskCardRequest {
  chat: Pick<ChatItem, 'id' | 'name'>
  message: Pick<Message, 'id' | 'senderName' | 'content' | 'timestamp' | 'type'>
}

export interface AgentTaskCardResponse {
  provider: 'llm' | 'fallback'
  taskCard: TaskCard
}
