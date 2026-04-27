'use client'

import { MessageSquare, Users, RefreshCw } from 'lucide-react'
import { TabType } from '@/types/chat'

interface BottomNavProps {
  activeTab: TabType
  onTabChange?: (tab: TabType) => void
}

interface NavItem {
  id: TabType
  icon: React.ReactNode
  label: string
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems: NavItem[] = [
    {
      id: 'messages',
      icon: <MessageSquare className="w-6 h-6" />,
      label: '消息'
    },
    {
      id: 'contacts',
      icon: <Users className="w-6 h-6" />,
      label: '联系人'
    },
    {
      id: 'moments',
      icon: <RefreshCw className="w-6 h-6" />,
      label: '动态'
    }
  ]
  
  return (
    <nav 
      className="flex items-center justify-around py-2 border-t border-border bg-background"
      role="tablist"
      aria-label="主导航"
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id
        
        return (
          <button
            key={item.id}
            onClick={() => onTabChange?.(item.id)}
            role="tab"
            aria-selected={isActive}
            aria-label={item.label}
            className={`
              flex flex-col items-center gap-1 px-6 py-2 rounded-lg
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
              ${isActive 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
