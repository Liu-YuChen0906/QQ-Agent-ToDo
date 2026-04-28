'use client'

import {
  ArrowLeft,
  Bell,
  Camera,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Clock,
  Copy,
  Forward,
  Languages,
  Menu,
  MessageSquareOff,
  Mic,
  Loader2,
  Plus,
  Quote,
  Send,
  Smile,
  Star,
  Trash2,
  Bot,
  Calendar,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { AgentTaskCardResponse } from '@/types/agent'
import type { ChatItem, Message, TaskCard } from '@/types/chat'

interface ChatDetailProps {
  chat: ChatItem
  onBack?: () => void
  onAddTaskFromMessage?: (message: Message) => void
}

const EMOJI_REACTIONS = [
  { emoji: '👍', label: '点赞' },
  { emoji: '🙏', label: '感谢' },
  { emoji: '❤️', label: '爱心' },
  { emoji: '😆', label: '好笑' },
  { emoji: '😢', label: '难过' },
  { emoji: '😮', label: '惊讶' },
]

const MENU_ACTIONS_ROW1 = [
  { icon: Copy, label: '复制', action: 'copy' },
  { icon: Forward, label: '转发', action: 'forward' },
  { icon: Star, label: '收藏', action: 'favorite' },
  { icon: Trash2, label: '删除', action: 'delete' },
  { icon: CheckSquare, label: '多选', action: 'multiSelect' },
]

const MENU_ACTIONS_ROW2 = [
  { icon: Quote, label: '引用', action: 'quote' },
  { icon: Languages, label: '翻译', action: 'translate' },
  { icon: Camera, label: '截图', action: 'screenshot' },
  { icon: Bot, label: '加入待办', action: 'aiTodo', highlight: true },
]

function useCountdown(targetTimestamp: number | null) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!targetTimestamp) {
      setTimeLeft('未设置')
      return
    }

    const calculateTimeLeft = () => {
      const diff = targetTimestamp - Date.now()

      if (diff <= 0) {
        setTimeLeft('已截止')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (hours > 24) {
        const days = Math.floor(hours / 24)
        setTimeLeft(`${days}天${hours % 24}小时`)
        return
      }

      if (hours > 0) {
        setTimeLeft(`${hours}小时${minutes}分`)
        return
      }

      setTimeLeft(`${minutes}分${seconds}秒`)
    }

    calculateTimeLeft()
    const timer = window.setInterval(calculateTimeLeft, 1000)
    return () => window.clearInterval(timer)
  }, [targetTimestamp])

  return timeLeft
}

function TaskCardComponent({ taskCard }: { taskCard: TaskCard }) {
  const timeLeft = useCountdown(taskCard.deadlineTimestamp)
  const source = taskCard.source

  return (
    <div className="bg-zinc-800 rounded-2xl overflow-hidden max-w-[300px] shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-medium text-sm">AI 待办任务</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-foreground font-semibold text-lg leading-snug line-clamp-2">
          {taskCard.title}
        </h3>

        <div className="mt-3 flex items-center justify-between p-2 bg-zinc-700/50 rounded-lg gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Clock className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <span className="text-zinc-300 text-sm truncate">{taskCard.deadline}</span>
          </div>
          {taskCard.deadlineTimestamp ? (
            <div className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 flex-shrink-0">
              剩余 {timeLeft}
            </div>
          ) : (
            <div className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-600/40 text-zinc-300 flex-shrink-0">
              暂无倒计时
            </div>
          )}
        </div>

        {source && (
          <div className="mt-3 rounded-xl border border-zinc-700/80 bg-zinc-900/40 p-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 mb-3">
              来源
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 flex-shrink-0 border border-zinc-700">
                  <AvatarImage src={source.chatAvatar} alt={source.chatName} />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    群
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">{source.chatName}</p>
                  <p className="text-xs text-zinc-400">来源群</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 flex-shrink-0 border border-zinc-700">
                  <AvatarImage src={source.senderAvatar} alt={source.senderName} />
                  <AvatarFallback className="bg-zinc-600 text-white text-xs">
                    人
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">{source.senderName}</p>
                  <p className="text-xs text-zinc-400">来源用户</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-3 mt-3 border-t border-zinc-700">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Calendar className="w-4 h-4" />
            存入日历
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium rounded-lg transition-colors">
            <Bell className="w-4 h-4" />
            设置提醒
          </button>
        </div>
      </div>
    </div>
  )
}
function AgentFeedbackToast({
  state,
}: {
  state: {
    kind: 'sending' | 'success' | 'reject' | 'error'
    subtitle?: string
  } | null
}) {
  if (!state) return null

  const copy =
    state.kind === 'sending'
      ? { title: 'QQ Agent 正在看', subtitle: state.subtitle ?? '判断是不是待办', Icon: Loader2 }
      : state.kind === 'success'
        ? { title: '任务卡已生成', subtitle: state.subtitle ?? '已转到 QQ Agent', Icon: CheckCircle2 }
        : state.kind === 'reject'
          ? { title: '不是待办', subtitle: state.subtitle ?? '补个动作和时间再试', Icon: Bot }
          : { title: '发送失败', subtitle: state.subtitle ?? '请稍后再试', Icon: CheckCircle2 }

  return (
    <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-blue-300">
          <copy.Icon className={`h-5 w-5 ${state.kind === 'sending' ? 'animate-spin' : ''}`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{copy.title}</p>
          <p className="text-xs text-zinc-400">{copy.subtitle}</p>
        </div>
      </div>
    </div>
  )
}
function TencentDocsIcon() {
  return (
    <div className="w-12 h-12 bg-[#00a854] rounded-lg flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="6" height="6" fill="white" rx="1" />
        <rect x="14" y="4" width="6" height="6" fill="white" rx="1" />
        <rect x="4" y="14" width="6" height="6" fill="white" rx="1" />
        <rect x="14" y="14" width="6" height="6" fill="white" rx="1" />
      </svg>
    </div>
  )
}

function AdminBadge() {
  return <span className="px-1.5 py-0.5 bg-teal-600 text-white text-xs rounded">管理员</span>
}

function DocumentCard({ document }: { document: NonNullable<Message['document']> }) {
  return (
    <div className="bg-zinc-800 rounded-xl p-3 max-w-[280px]">
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-foreground text-base leading-snug line-clamp-2">{document.title}</p>
          {document.subtitle && (
            <p className="text-muted-foreground text-sm mt-1">{document.subtitle}</p>
          )}
        </div>
        <TencentDocsIcon />
      </div>
      <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-zinc-700">
        <div className="w-4 h-4 bg-[#00a854] rounded flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">T</span>
        </div>
        <span className="text-muted-foreground text-sm">腾讯文档</span>
      </div>
    </div>
  )
}

function QuoteCard({ quote }: { quote: NonNullable<Message['quote']> }) {
  return (
    <div className="bg-zinc-700 rounded-lg p-3 max-w-[280px] mb-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground text-sm">
            {quote.senderName} {quote.timestamp}
          </p>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{quote.content}</p>
        </div>
        <div className="text-muted-foreground text-lg">↗</div>
      </div>
    </div>
  )
}

function TimeSeparator({ time }: { time: string }) {
  return (
    <div className="flex justify-center py-4">
      <span className="text-muted-foreground text-sm">{time}</span>
    </div>
  )
}

function MessageBubble({
  message,
  isCurrentUser,
  isSelected,
  onLongPress,
}: {
  message: Message
  isCurrentUser: boolean
  isSelected: boolean
  onLongPress: (e: ReactMouseEvent | ReactTouchEvent, messageId: string) => void
}) {
  const longPressTimer = useRef<number | null>(null)
  const touchStartPos = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback(
    (e: ReactTouchEvent) => {
      const touch = e.touches[0]
      touchStartPos.current = { x: touch.clientX, y: touch.clientY }

      longPressTimer.current = window.setTimeout(() => {
        onLongPress(e, message.id)
      }, 500)
    },
    [message.id, onLongPress]
  )

  const handleTouchMove = useCallback((e: ReactTouchEvent) => {
    if (!touchStartPos.current) return

    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x)
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y)

    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimer.current) {
        window.clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    touchStartPos.current = null
  }, [])

  const handleContextMenu = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault()
      onLongPress(e, message.id)
    },
    [message.id, onLongPress]
  )

  if (message.type === 'system') {
    return (
      <div className="flex justify-center py-2">
        <span className="text-muted-foreground text-sm">{message.content}</span>
      </div>
    )
  }

  return (
    <div
      className={`flex gap-3 py-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
    >
      {!isCurrentUser && (
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={message.senderAvatar} alt={message.senderName} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
            {message.senderName.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        {!isCurrentUser && (
          <div className="flex items-center gap-2 mb-1">
            {message.isAdmin && <AdminBadge />}
            <span className="text-muted-foreground text-sm">{message.senderName}</span>
          </div>
        )}

        <div className="relative">
          {isSelected && <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full" />}

          {message.type === 'taskCard' && message.taskCard && (
            <TaskCardComponent taskCard={message.taskCard} />
          )}

          {message.type === 'document' && message.document && (
            <div className={`transition-colors ${isSelected ? 'bg-blue-500/20 rounded-xl' : ''}`}>
              <DocumentCard document={message.document} />
            </div>
          )}

          {message.type === 'link' && message.link && (
            <div
              className={`bg-zinc-800 rounded-xl p-3 max-w-[280px] transition-colors ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
              }`}
            >
              <p className="text-foreground">
                {message.content}
                <a
                  href={message.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline break-all"
                >
                  {message.link.text}
                </a>
              </p>
            </div>
          )}

          {message.type === 'quote' && message.quote && (
            <div
              className={`bg-zinc-800 rounded-xl p-3 max-w-[280px] transition-colors ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
              }`}
            >
              <QuoteCard quote={message.quote} />
              <p className="text-foreground">{message.content}</p>
            </div>
          )}

          {message.type === 'text' && (
            <div
              className={`rounded-xl p-3 max-w-[280px] transition-colors ${
                isCurrentUser
                  ? isSelected
                    ? 'bg-blue-700 text-white ring-2 ring-blue-400'
                    : 'bg-blue-600 text-white'
                  : isSelected
                    ? 'bg-blue-500/20 text-foreground ring-2 ring-blue-500'
                    : 'bg-zinc-800 text-foreground'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          )}

          {message.type === 'image' && (
            <div
              className={`bg-zinc-800 rounded-xl p-3 max-w-[280px] transition-colors ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
              }`}
            >
              <div className="w-32 h-32 bg-zinc-700 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">[图片]</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ContextMenu({
  isOpen,
  position,
  onClose,
  onAction,
  onReaction,
}: {
  isOpen: boolean
  position: { x: number; y: number }
  onClose: () => void
  onAction: (action: string) => void
  onReaction: (emoji: string) => void
}) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const safeY = Math.min(position.y, window.innerHeight - 280)
  const safeX = Math.min(Math.max(position.x - 150, 16), window.innerWidth - 316)

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div
        ref={menuRef}
        className="fixed z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150"
        style={{ left: safeX, top: safeY }}
      >
        <div className="flex items-center gap-1 bg-zinc-800 rounded-full p-2">
          {EMOJI_REACTIONS.map((reaction) => (
            <button
              key={reaction.emoji}
              onClick={() => {
                onReaction(reaction.emoji)
                onClose()
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-700 transition-colors text-2xl"
              aria-label={reaction.label}
            >
              {reaction.emoji}
            </button>
          ))}
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors"
            aria-label="关闭表情栏"
          >
            <ChevronDown className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="bg-zinc-800 rounded-2xl p-3 min-w-[300px]">
          <div className="flex justify-between mb-3">
            {MENU_ACTIONS_ROW1.map((item) => (
              <button
                key={item.action}
                onClick={() => {
                  onAction(item.action)
                  onClose()
                }}
                className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-zinc-700 transition-colors min-w-[52px]"
              >
                <item.icon className="w-5 h-5 text-zinc-300" />
                <span className="text-zinc-300 text-xs">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-start gap-1">
            {MENU_ACTIONS_ROW2.map((item) => (
              <button
                key={item.action}
                onClick={() => {
                  onAction(item.action)
                  onClose()
                }}
                className={`flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-zinc-700 transition-colors min-w-[52px] ${
                  item.highlight ? 'bg-zinc-700/50' : ''
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${item.highlight ? 'text-blue-400' : 'text-zinc-300'}`}
                />
                <span
                  className={`text-xs whitespace-nowrap ${
                    item.highlight ? 'text-blue-400' : 'text-zinc-300'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export function ChatDetail({ chat, onBack, onAddTaskFromMessage }: ChatDetailProps) {
  const [message, setMessage] = useState('')
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [agentToast, setAgentToast] = useState<{
    kind: 'sending' | 'success' | 'reject' | 'error'
    subtitle?: string
  } | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean
    position: { x: number; y: number }
    messageId: string | null
  }>({ isOpen: false, position: { x: 0, y: 0 }, messageId: null })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const switchTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (switchTimerRef.current) {
        window.clearTimeout(switchTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!agentToast) return

    const duration =
      agentToast.kind === 'sending'
        ? 1200
        : agentToast.kind === 'success'
          ? 900
          : agentToast.kind === 'reject'
            ? 2200
            : 1600

    const timer = window.setTimeout(() => {
      setAgentToast(null)
    }, duration)

    return () => window.clearTimeout(timer)
  }, [agentToast])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.messages])

  const handleSend = () => {
    if (message.trim()) {
      setMessage('')
    }
  }

  const handleLongPress = useCallback((e: ReactMouseEvent | ReactTouchEvent, messageId: string) => {
    let x: number
    let y: number

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0]
      x = touch.clientX
      y = touch.clientY
    } else {
      x = e.clientX
      y = e.clientY
    }

    setContextMenu({
      isOpen: true,
      position: { x, y },
      messageId,
    })
  }, [])

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, messageId: null })
  }, [])

  const handleAction = useCallback(
    async (action: string) => {
      const selectedMessage = chat.messages?.find((item) => item.id === contextMenu.messageId)

      switch (action) {
        case 'copy':
          if (selectedMessage?.content) {
            navigator.clipboard.writeText(selectedMessage.content)
          }
          break
        case 'aiTodo':
          if (!selectedMessage || isCreatingTask) {
            break
          }

          setIsCreatingTask(true)
          setAgentToast({
            kind: 'sending',
            subtitle: '正在判断是否为待办事项',
          })

          try {
            const agentInput =
              selectedMessage.content ||
              selectedMessage.document?.title ||
              selectedMessage.link?.text ||
              selectedMessage.quote?.content ||
              '[消息内容为空]'

            const response = await fetch('/api/agent/task-card', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chat: {
                  id: chat.id,
                  name: chat.name,
                },
                message: {
                  id: selectedMessage.id,
                  senderName: selectedMessage.senderName,
                  content: agentInput,
                  timestamp: selectedMessage.timestamp,
                  type: selectedMessage.type,
                },
              }),
            })

            const data = (await response.json()) as AgentTaskCardResponse & { error?: string }

            if (!response.ok) {
              throw new Error(data.error || '任务卡生成失败')
            }

            if (!data.shouldCreateTask) {
              setAgentToast({
                kind: 'reject',
                subtitle: data.responsePrompt,
              })
              setIsCreatingTask(false)
              break
            }

            const taskMessage: Message = {
              id: `task-${selectedMessage.id}-${Date.now()}`,
              senderId: 'robot',
              senderName: 'QQ Agent',
              senderAvatar: '/avatars/robot.jpg',
              content: '',
              timestamp: '刚刚',
              type: 'taskCard',
              taskCard: {
                ...data.taskCard,
                source: {
                  chatName: chat.name,
                  chatAvatar: chat.avatar,
                  senderName: selectedMessage.senderName,
                  senderAvatar: selectedMessage.senderAvatar,
                },
              },
            }

            setAgentToast({
              kind: 'success',
              subtitle: '正在打开 QQ Agent 对话',
            })
            setIsCreatingTask(false)

            switchTimerRef.current = window.setTimeout(() => {
              onAddTaskFromMessage?.(taskMessage)
            }, 650)
          } catch (error) {
            console.error('[agent] generate task card failed:', error)
            setAgentToast({
              kind: 'error',
              subtitle: '请稍后再试',
            })
            setIsCreatingTask(false)
          }
          break
        default:
          break
      }
    },
    [chat.id, chat.name, chat.messages, contextMenu.messageId, isCreatingTask, onAddTaskFromMessage]
  )
  const handleReaction = useCallback((_emoji: string) => {
    // Reaction placeholder for future sync with backend.
  }, [])

  const groupedMessages = chat.messages?.reduce(
    (acc, msg, index) => {
      const prevMsg = chat.messages?.[index - 1]
      if (prevMsg && msg.timestamp.includes('昨天') && !prevMsg.timestamp.includes('昨天')) {
        acc.push({ type: 'separator' as const, time: msg.timestamp })
      }
      acc.push({ type: 'message' as const, message: msg })
      return acc
    },
    [] as Array<{ type: 'separator'; time: string } | { type: 'message'; message: Message }>
  )

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-foreground -ml-2"
            aria-label="返回"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-2">
            {chat.isBot && (
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="text-lg font-medium text-foreground truncate max-w-[200px]">
              {chat.name}
              {chat.memberCount && <span className="text-muted-foreground">({chat.memberCount})</span>}
            </span>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="text-foreground" aria-label="更多选项">
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        {groupedMessages?.map((item, index) => {
          if (item.type === 'separator') {
            return <TimeSeparator key={`sep-${index}`} time={item.time} />
          }

          return (
            <MessageBubble
              key={item.message.id}
              message={item.message}
              isCurrentUser={item.message.senderId === 'user-1'}
              isSelected={contextMenu.isOpen && contextMenu.messageId === item.message.id}
              onLongPress={handleLongPress}
            />
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {chat.isMutedAll ? (
        <div className="flex items-center justify-center gap-2 px-4 py-4 border-t border-border">
          <MessageSquareOff className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">全员禁言中，仅群主和管理员可发言</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground flex-shrink-0"
            aria-label="添加附件"
          >
            <Plus className="w-6 h-6" />
          </Button>

          <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入消息..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-base focus:outline-none"
              aria-label="输入消息"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-8 w-8"
              aria-label="表情"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>

          {message.trim() ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSend}
              className="text-primary flex-shrink-0"
              aria-label="发送消息"
            >
              <Send className="w-6 h-6" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground flex-shrink-0"
              aria-label="语音消息"
            >
              <Mic className="w-6 h-6" />
            </Button>
          )}
        </div>
      )}

      <AgentFeedbackToast state={agentToast} />

      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={handleCloseContextMenu}
        onAction={handleAction}
        onReaction={handleReaction}
      />
    </div>
  )
}




















