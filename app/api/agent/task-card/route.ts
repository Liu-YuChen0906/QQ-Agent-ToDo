import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { AgentTaskCardRequest, AgentTaskCardResponse } from '@/types/agent'
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

const ModelResponseSchema = z.object({
  taskName: z.string().min(1),
  deadlineText: z.string().min(1),
  deadlineISO: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
})

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

function buildFallbackTaskCard(messageText: string): TaskCard {
  const text = normalizeText(messageText)
  const taskName =
    text
      .replace(/^(请|帮我|麻烦|帮忙|需要|把|将)\s*/u, '')
      .split(/[。！？!?；;\n]/)[0]
      ?.slice(0, 24)
      .trim() || '待办任务'

  const deadlineText = extractDeadlineText(text) || '明天 18:00'
  const deadlineTimestamp = buildDeadlineTimestamp(deadlineText)
  const steps = buildFallbackSteps(text)

  return {
    title: taskName,
    deadline: deadlineText,
    deadlineTimestamp,
    steps,
  }
}

function extractDeadlineText(text: string) {
  const patterns = [
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
  const hour = timeMatch ? Number(timeMatch[1]) : 18
  const minute = timeMatch ? Number(timeMatch[2]) : 0
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

async function generateWithTencentLLM(
  requestData: AgentTaskCardRequest,
): Promise<AgentTaskCardResponse> {
  const { apiKey, baseUrl, model } = getApiConfig()

  if (!apiKey) {
    return {
      provider: 'fallback',
      taskCard: buildFallbackTaskCard(requestData.message.content),
    }
  }

  const prompt = [
    `当前时间：${getNowText()}`,
    `时区：${TIME_ZONE}`,
    '',
    '你是一个任务抽取 Agent。',
    '请从用户消息中抽取一张结构化任务卡片。',
    '只输出 JSON 对象，不要输出解释、不要输出 markdown。',
    '必须包含以下字段：',
    '- taskName：自动提取最适合作为任务标题的短标题',
    '- deadlineText：识别出的 DDL，尽量保留原始表达，如“明天 15:00”',
    '- deadlineISO：把 deadlineText 解析成 ISO 8601，使用 Asia/Shanghai 时区',
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
          content: '你是一个只输出严格 JSON 的任务抽取 Agent。',
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

  const parsed = ModelResponseSchema.parse(JSON.parse(outputText))
  const deadlineTimestamp = Date.parse(parsed.deadlineISO)

  if (!Number.isFinite(deadlineTimestamp)) {
    throw new Error('LLM returned an invalid deadlineISO value')
  }

  return {
    provider: 'llm',
    taskCard: {
      title: parsed.taskName.trim(),
      deadline: parsed.deadlineText.trim(),
      deadlineTimestamp,
      steps: parsed.steps.map((item) => item.trim()).filter(Boolean),
    },
  }
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

    const fallback = buildFallbackTaskCard(parsed.data.message.content)
    return NextResponse.json({
      provider: 'fallback',
      taskCard: fallback,
    } satisfies AgentTaskCardResponse)
  }
}
