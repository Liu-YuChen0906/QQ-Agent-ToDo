'use client'

import { ChatItem } from '@/types/chat'
import { ChatListItem } from './ChatListItem'

interface ChatListProps {
  chats: ChatItem[]
  onChatClick?: (chat: ChatItem) => void
  onChatLongPress?: (chat: ChatItem) => void
}

export function ChatList({ chats, onChatClick, onChatLongPress }: ChatListProps) {
  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-base">暂无消息</p>
        <p className="text-sm mt-1">开始新的对话吧</p>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col" role="list" aria-label="聊天列表">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          onClick={onChatClick}
          onLongPress={onChatLongPress}
        />
      ))}
    </div>
  )
}
