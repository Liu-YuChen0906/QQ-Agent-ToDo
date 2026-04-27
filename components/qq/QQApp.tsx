'use client'

import { useCallback, useState } from 'react'
import type { Message } from '@/types/chat'
import { ChatItem, TabType } from '@/types/chat'
import { currentUser, mockChats } from '@/data/mock-chats'
import { BottomNav } from './BottomNav'
import { ChatDetail } from './ChatDetail'
import { ChatList } from './ChatList'
import { DeviceLoginBar } from './DeviceLoginBar'
import { SearchBar } from './SearchBar'
import { StatusBar } from './StatusBar'
import { UserHeader } from './UserHeader'

export function QQApp() {
  const [activeTab, setActiveTab] = useState<TabType>('messages')
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null)
  const [chats, setChats] = useState<ChatItem[]>(mockChats)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleChatClick = useCallback((chat: ChatItem) => {
    setSelectedChat(chat)
    setChats((prev) =>
      prev.map((item) => (item.id === chat.id ? { ...item, unreadCount: 0 } : item))
    )
  }, [])

  const handleChatLongPress = useCallback((chat: ChatItem) => {
    console.log('[qq] long press:', chat.name)
  }, [])

  const handleBack = useCallback(() => {
    setSelectedChat(null)
  }, [])

  const handleAddClick = useCallback(() => {
    console.log('[qq] add clicked')
  }, [])

  const handleProfileClick = useCallback(() => {
    console.log('[qq] profile clicked')
  }, [])

  const handleDeviceClick = useCallback(() => {
    console.log('[qq] device login clicked')
  }, [])

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab)
    setSelectedChat(null)
  }, [])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleAddTaskFromMessage = useCallback((taskMessage: Message) => {
    let nextAgentChat: ChatItem | null = null

    setChats((prev) => {
      const agentChatId = 'chat-robot'
      const target = prev.find((item) => item.id === agentChatId)

      if (!target) {
        return prev
      }

      nextAgentChat = {
        ...target,
        unreadCount: 0,
        messages: [...(target.messages ?? []), taskMessage],
        lastMessage: taskMessage.taskCard
          ? `AI 已生成待办：${taskMessage.taskCard.title}`
          : 'AI 已生成待办',
        timestamp: '刚刚',
      }

      return prev.map((item) => (item.id === agentChatId ? nextAgentChat! : item))
    })

    if (nextAgentChat) {
      setSelectedChat(nextAgentChat)
    }
  }, [])
  if (selectedChat) {
    return (
      <div className="h-screen">
        <ChatDetail
          chat={selectedChat}
          onBack={handleBack}
          onAddTaskFromMessage={handleAddTaskFromMessage}
        />
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'messages':
        return (
          <>
            <DeviceLoginBar onClick={handleDeviceClick} />
            <ChatList
              chats={filteredChats}
              onChatClick={handleChatClick}
              onChatLongPress={handleChatLongPress}
            />
          </>
        )
      case 'contacts':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg">联系人</p>
            <p className="text-sm mt-1">联系人列表将在此显示</p>
          </div>
        )
      case 'moments':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg">动态</p>
            <p className="text-sm mt-1">好友动态将在此显示</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <StatusBar />

      <UserHeader user={currentUser} onAddClick={handleAddClick} onProfileClick={handleProfileClick} />

      <SearchBar onSearch={handleSearch} />

      <main className="flex-1 overflow-y-auto">{renderTabContent()}</main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}

