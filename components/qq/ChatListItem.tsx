'use client'

import { BellOff } from 'lucide-react'
import { ChatItem } from '@/types/chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ChatListItemProps {
  chat: ChatItem
  onClick?: (chat: ChatItem) => void
  onLongPress?: (chat: ChatItem) => void
}

export function ChatListItem({ chat, onClick, onLongPress }: ChatListItemProps) {
  const handleClick = () => {
    onClick?.(chat)
  }
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    onLongPress?.(chat)
  }
  
  return (
    <button
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 active:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
      aria-label={`打开与${chat.name}的对话`}
    >
      {/* Avatar with optional badge */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
            {chat.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        
        {/* Unread count badge */}
        {chat.unreadCount !== undefined && chat.unreadCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center px-1.5 bg-red-500 text-white text-xs font-medium rounded-full"
            aria-label={`${chat.unreadCount}条未读消息`}
          >
            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
          </span>
        )}
      </div>
      
      {/* Chat content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium text-foreground truncate">
            {chat.name}
          </span>
          
          {/* Emoji badges */}
          {chat.badges && chat.badges.length > 0 && (
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {chat.badges.slice(0, 6).map((badge, index) => (
                <span key={index} className="text-sm">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground truncate mt-0.5">
          {chat.lastMessage}
        </p>
      </div>
      
      {/* Timestamp and mute icon */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {chat.timestamp}
        </span>
        
        {chat.isMuted && (
          <BellOff 
            className="w-4 h-4 text-muted-foreground" 
            aria-label="已静音"
          />
        )}
      </div>
    </button>
  )
}
