'use client'

import { Plus, ChevronRight } from 'lucide-react'
import { UserProfile } from '@/types/chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface UserHeaderProps {
  user: UserProfile
  onAddClick?: () => void
  onProfileClick?: () => void
}

export function UserHeader({ user, onAddClick, onProfileClick }: UserHeaderProps) {
  const statusColor = user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
  
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button 
        onClick={onProfileClick}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-lg"
        aria-label="查看个人资料"
      >
        <Avatar className="h-12 w-12 border-2 border-muted">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {user.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col items-start">
          <span className="text-lg font-semibold text-foreground">{user.name}</span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className={`w-2 h-2 rounded-full ${statusColor}`} />
            <span className="text-sm">
              在线 - {user.networkType}
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onAddClick}
        className="text-foreground hover:bg-muted"
        aria-label="添加好友或群聊"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  )
}
