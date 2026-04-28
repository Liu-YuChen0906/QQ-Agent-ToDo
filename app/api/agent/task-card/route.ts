import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type {
  AgentTaskCardRequest,
  AgentTaskCardRejectedResponse,
  AgentTaskCardResponse,
  AgentTaskCardSuccessResponse,
} from '@/types/agent'
import type { TaskCard } from '@/types/chat'

const RequestSchema = z.object({
  chat: z.object({
    id: z.string(),
    name: z.string(),
  }),
  message: z.object({
    id: z.string(),
    senderName: z.string(),
    content: z.string().default(''),
    timestamp: z.string(),
    type: z.enum(['text', 'document', 'link', 'image', 'quote', 'system', 'taskCard']),
  }),
})

const TodoSchema = z.object({
  shouldCreateTask: z.literal(true),
  responsePrompt: z.string().min(1),
  suggestions: z.array(z.string().min(1)).min(1).max(4),
  taskName: z.string().min(1),
  deadlineText: z.string().optional().nullable(),
  deadlineISO: z.string().optional().nullable(),
  steps: z.array(z.string().min(1)).min(1),
})

const RejectedSchema = z.object({
  shouldCreateTask: z.literal(false),
  responsePrompt: z.string().min(1),
  suggestions: z.array(z.string().min(1)).min(1).max(4),
})

const ModelResponseSchema = z.union([TodoSchema, RejectedSchema])

const DEFAULT_BASE_URL = 'https://api.lkeap.cloud.tencent.com/plan/v3'
const DEFAULT_MODEL = 'hy3-preview'
const TIME_ZONE = 'Asia/Shanghai'

function getApiConfig() {
  const apiKey = process.env.LLM_API_KEY?.trim()
  const baseUrl = (process.env.LLM_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/$/, '')
  const model = process.env.LLM_MODEL?.trim() || DEFAULT_MODEL

  return { apiKey, baseUrl, model }
}

function getNowText() {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: TIME_ZONE,
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(new Date())
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function compactTaskTitle(raw: string) {
  const normalized = normalizeText(raw)
  if (!normalized) return '待办任务'

  const firstSentence = normalized.split(/[。！？!?；;\n]/u)[0] || normalized
  const removedPrefix = firstSentence
    .replace(/^(@\S+\s*)+/u, '')
    .replace(/^(请|帮我|麻烦|帮忙|需要|记得|务必|尽快|辛苦|把|将|给我|你去)\s*/u, '')
    .replace(/(谢谢|收到|哈|啊|呀|啦)$/u, '')
    .trim()

  const cleaned = removedPrefix.replace(/[，,].*$/u, '').trim()
  const clipped = cleaned.slice(0, 18).trim()

  if (!clipped) return '待办任务'
  return /^[\p{L}\p{N}]/u.test(clipped) ? clipped : `处理${clipped}`
}

function buildFallbackTodoDecision(messageText: string): AgentTaskCardResponse {
  const text = normalizeText(messageText)
  const looksLikeTodo = isProbablyTodo(text)

  if (!looksLikeTodo) {
    return {
      provider: 'fallback',
      shouldCreateTask: false,
      responsePrompt: buildRejectedPrompt(text),
      suggestions: [
        '写清动作',
        '补上时间',
        '补上交付物',
      ],
    }
  }

  const taskCard = buildFallbackTaskCard(text)
  return {
    provider: 'fallback',
    shouldCreateTask: true,
    taskCard,
  }
}

function isProbablyTodo(text: string) {
  const todoPatterns = [
    /(请|帮我|麻烦|帮忙|需要|安排|整理|准备|提交|完成|制作|撰写|汇总|修改|更新|发送|提醒|记录|同步|确认|处理|购买|预约|报名|收集)/u,
    /(待办|ddl|截止|截止时间|今晚|明天|后天|本周|下周|之前|前)/u,
    /(开会|报告|方案|文档|表格|ppt|页面|代码|任务|作业|邮件|通知|清单)/u,
  ]

  return todoPatterns.some((pattern) => pattern.test(text))
}

function buildRejectedPrompt(text: string) {
  if (!text) {
    return '这条消息还不够像待办事项，可以再补充具体要做什么、什么时候完成。'
  }

  return '这条不像待办。补个动作和时间再试。'
}

function buildFallbackTaskCard(messageText: string): TaskCard {
  const text = normalizeText(messageText)
  const taskName = compactTaskTitle(text)
  const deadlineText = extractDeadlineText(text)
  const deadlineTimestamp = deadlineText ? buildDeadlineTimestamp(deadlineText) : null
  const steps = buildFallbackSteps(text)

  return {
    title: taskName,
    deadline: deadlineText || '未设置截止时间',
    deadlineTimestamp,
    steps,
  }
}

function extractDeadlineText(text: string) {
  const patterns = [
    /(今天|明天|后天|今晚|今早|今晨|今晚|明早|明晚)\s*(\d{1,2}:\d{2})?/u,
    /(本周[一二三四五六日天]?|下周[一二三四五六日天]?|周[一二三四五六日天])\s*(上午|中午|下午|晚上)?\s*(\d{1,2}:\d{2})?/u,
    /(本月内|月底|月末|本周内|下周内|尽快|有空时|下班前|今天内)/u,
    /今天\s*\d{1,2}:\d{2}/u,
    /明天\s*\d{1,2}:\d{2}/u,
    /后天\s*\d{1,2}:\d{2}/u,
    /\d{1,2}月\d{1,2}日\s*\d{1,2}:\d{2}/u,
    /\d{1,2}:\d{2}/u,
    /周[一二三四五六日天]\s*\d{1,2}:\d{2}/u,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[0]) {
      return normalizeText(match[0])
    }
  }

  return ''
}

function buildDeadlineTimestamp(deadlineText: string) {
  const now = new Date()
  const deadline = new Date(now)

  if (/后天/u.test(deadlineText)) {
    deadline.setDate(deadline.getDate() + 2)
  } else if (/明天/u.test(deadlineText)) {
    deadline.setDate(deadline.getDate() + 1)
  }

  const monthDayMatch = deadlineText.match(/(\d{1,2})月(\d{1,2})日/u)
  if (monthDayMatch) {
    deadline.setMonth(Number(monthDayMatch[1]) - 1, Number(monthDayMatch[2]))
  }

  const timeMatch = deadlineText.match(/(\d{1,2}):(\d{2})/u)
  let hour = timeMatch ? Number(timeMatch[1]) : 0
  let minute = timeMatch ? Number(timeMatch[2]) : 0

  if (!timeMatch) {
    if (/今晚|明晚|晚上/u.test(deadlineText)) {
      hour = 21
    } else if (/下午/u.test(deadlineText)) {
      hour = 15
    } else if (/中午/u.test(deadlineText)) {
      hour = 12
    } else if (/今早|今晨|明早|上午/u.test(deadlineText)) {
      hour = 9
    } else if (/下班前/u.test(deadlineText)) {
      hour = 18
    } else {
      return null
    }
  }
  deadline.setHours(hour, minute, 0, 0)

  if (deadline.getTime() <= now.getTime()) {
    deadline.setDate(deadline.getDate() + 1)
  }

  return deadline.getTime()
}

function buildFallbackSteps(messageText: string) {
  const chunks = messageText
    .split(/[。！？!?；;\n]/u)
    .map((item) => item.trim())
    .filter(Boolean)

  const steps = chunks.filter((item) => item.length >= 3).slice(0, 5)

  if (steps.length >= 2) {
    return steps
  }

  return ['确认任务目标', '拆解执行步骤', '按截止时间完成并提交']
}

function extractChatCompletionText(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return ''
  }

  const data = payload as {
    choices?: Array<{
      message?: {
        content?: string | null
      }
    }>
  }

  const content = data.choices?.[0]?.message?.content
  return typeof content === 'string' ? content.trim() : ''
}

function parseModelResponse(outputText: string): AgentTaskCardResponse {
  const parsed = ModelResponseSchema.parse(JSON.parse(outputText))

  if (!parsed.shouldCreateTask) {
    const rejected: AgentTaskCardRejectedResponse = {
      provider: 'llm',
      shouldCreateTask: false,
      responsePrompt: parsed.responsePrompt,
      suggestions: parsed.suggestions,
    }
    return rejected
  }

  const normalizedTaskName = compactTaskTitle(parsed.taskName)
  const normalizedDeadlineText = normalizeText(parsed.deadlineText || '')
  const llmDeadlineTimestamp = parsed.deadlineISO ? Date.parse(parsed.deadlineISO) : Number.NaN
  const deadlineTimestamp = Number.isFinite(llmDeadlineTimestamp)
    ? llmDeadlineTimestamp
    : normalizedDeadlineText
      ? buildDeadlineTimestamp(normalizedDeadlineText)
      : null

  const success: AgentTaskCardSuccessResponse = {
    provider: 'llm',
    shouldCreateTask: true,
    taskCard: {
      title: normalizedTaskName,
      deadline: normalizedDeadlineText || '未设置截止时间',
      deadlineTimestamp,
      steps: parsed.steps.map((item) => item.trim()).filter(Boolean),
    },
  }

  return success
}

async function generateWithTencentLLM(
  requestData: AgentTaskCardRequest,
): Promise<AgentTaskCardResponse> {
  const { apiKey, baseUrl, model } = getApiConfig()

  if (!apiKey) {
    return buildFallbackTodoDecision(requestData.message.content)
  }

  const prompt = [
    `当前时间：${getNowText()}`,
    `时区：${TIME_ZONE}`,
    '',
    '你是一个待办判断和任务抽取 Agent。',
    '先判断用户消息是否是待办事项。只有在包含明确行动、交付物、负责人、截止时间或任务意图时，才认为是待办。',
    '如果不是待办事项，必须输出 shouldCreateTask=false，并给出一句非常简短的 responsePrompt 和 2-4 条 suggestions。',
    '如果是待办事项，必须输出 shouldCreateTask=true，并给出结构化任务卡片信息。',
    'taskName 必须是凝练短语（建议 6-16 个字），禁止直接照抄整句聊天消息，优先使用“动词+对象”的标题。',
    '只输出 JSON 对象，不要输出解释、不要输出 markdown。',
    '字段要求：',
    '- shouldCreateTask：布尔值',
    '- responsePrompt：一句非常简短的提示语',
    '- suggestions：提示建议数组',
    '- taskName：自动提取最适合作为任务标题的一句话或短语，要凝练，不要复述原消息',
    '- deadlineText：识别出的 DDL，尽量保留原始表达，如“明天 15:00”；若无法识别则留空字符串',
    '- deadlineISO：把 deadlineText 解析成 ISO 8601，使用 Asia/Shanghai 时区；若无法识别则留空字符串',
    '- steps：拆解为 3-7 条可执行步骤',
    '',
    `消息来自：${requestData.chat.name}`,
    `消息发送者：${requestData.message.senderName}`,
    `消息内容：${requestData.message.content || requestData.message.timestamp}`,
  ].join('\n')

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            '你是一个只输出严格 JSON 的消息分类与任务抽取 Agent。请严格遵守字段要求。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      response_format: {
        type: 'json_object',
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`LLM request failed: ${response.status} ${errorText}`)
  }

  const payload = await response.json()
  const outputText = extractChatCompletionText(payload)

  if (!outputText) {
    throw new Error('LLM returned empty content')
  }

  return parseModelResponse(outputText)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = RequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request payload' },
      { status: 400 }
    )
  }

  try {
    const response = await generateWithTencentLLM(parsed.data)
    return NextResponse.json(response)
  } catch (error) {
    console.error('[agent/task-card] failed:', error)

    return NextResponse.json(buildFallbackTodoDecision(parsed.data.message.content))
  }
}
