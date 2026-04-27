// QQ Chat Types - Extensible for future features

export interface ChatItem {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unreadCount?: number
  isMuted?: boolean
  isOnline?: boolean
  badges?: string[] // For emoji badges like in group chats
  memberCount?: number // For group chats
  messages?: Message[]
  isMutedAll?: boolean // 鍏ㄥ憳绂佽█
  isBot?: boolean // For AI agent/bot chats
}

export interface TaskCardSource {
  chatName: string
  chatAvatar: string
  senderName: string
  senderAvatar: string
}

export interface TaskCard {
  title: string
  deadline: string
  deadlineTimestamp: number // Unix timestamp for countdown
  steps: string[]
  source?: TaskCardSource
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  isAdmin?: boolean
  content: string
  timestamp: string
  type: 'text' | 'document' | 'link' | 'image' | 'quote' | 'system' | 'taskCard'
  // For document type
  document?: {
    title: string
    subtitle?: string
    icon: 'tencent-docs' | 'excel' | 'word' | 'pdf'
  }
  // For quote type
  quote?: {
    senderName: string
    content: string
    timestamp?: string
  }
  // For link type
  link?: {
    url: string
    text: string
  }
  // For task card type (AI generated)
  taskCard?: TaskCard
}

export interface UserProfile {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'busy' | 'away'
  networkType?: string
}

export type TabType = 'messages' | 'contacts' | 'moments'

export interface DeviceLogin {
  type: 'windows' | 'mac' | 'mobile'
  isActive: boolean
}

