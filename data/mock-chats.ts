import { ChatItem, UserProfile } from '@/types/chat'

export const currentUser: UserProfile = {
  id: 'user-1',
  name: 'Heartea',
  avatar: '/avatars/user.jpg',
  status: 'online',
  networkType: '5G'
}

export const mockChats: ChatItem[] = [
  {
    id: 'chat-robot',
    name: 'QQ Agent',
    avatar: '/avatars/robot.jpg',
    lastMessage: '有什么可以帮助您的？',
    timestamp: '刚刚',
    isMuted: false,
    isBot: true,
    messages: [
      {
        id: 'msg-robot-1',
        senderId: 'robot',
        senderName: 'QQ Agent',
        senderAvatar: '/avatars/robot.jpg',
        content: '你好！我是 QQ Agent，您的智能助手。我可以帮助您：\n\n• 管理待办事项和日程\n• 提取消息中的重要信息\n• 设置提醒和倒计时\n• 智能回复和翻译',
        timestamp: '上午9:00',
        type: 'text'
      },
      {
        id: 'msg-robot-2',
        senderId: 'user-1',
        senderName: 'Heartea',
        senderAvatar: '/avatars/user.jpg',
        content: '帮我整理一下今天的待办事项',
        timestamp: '上午9:05',
        type: 'text'
      },
      {
        id: 'msg-robot-3',
        senderId: 'robot',
        senderName: 'QQ Agent',
        senderAvatar: '/avatars/robot.jpg',
        content: '好的，我已为您整理了今日待办事项：',
        timestamp: '上午9:06',
        type: 'text'
      },
      {
        id: 'msg-robot-4',
        senderId: 'robot',
        senderName: 'QQ Agent',
        senderAvatar: '/avatars/robot.jpg',
        content: '',
        timestamp: '上午9:06',
        type: 'taskCard',
        taskCard: {
          title: '完成毕业设计开题报告',
          deadline: '今天 18:00',
          deadlineTimestamp: Date.now() + 6 * 60 * 60 * 1000, // 6 hours from now
          steps: [
            '整理研究背景和意义',
            '撰写文献综述部分',
            '确定研究方法和技术路线',
            '填写开题报告模板',
            '提交至教务系统'
          ]
        }
      },
      {
        id: 'msg-robot-5',
        senderId: 'user-1',
        senderName: 'Heartea',
        senderAvatar: '/avatars/user.jpg',
        content: '收到，谢谢！',
        timestamp: '上午9:10',
        type: 'text'
      },
      {
        id: 'msg-robot-6',
        senderId: 'robot',
        senderName: 'QQ Agent',
        senderAvatar: '/avatars/robot.jpg',
        content: '有什么可以帮助您的？',
        timestamp: '刚刚',
        type: 'text'
      }
    ]
  },
  {
    id: 'chat-1',
    name: '2026PCG校园AI产品创意大...',
    avatar: '/avatars/group1.jpg',
    lastMessage: '可盐可甜加入了群聊',
    timestamp: '上午10:01',
    isMuted: false,
    memberCount: 128,
    messages: [
      {
        id: 'msg-1-1',
        senderId: 'admin-1',
        senderName: '赛事组委会',
        senderAvatar: '/avatars/group1.jpg',
        isAdmin: true,
        content: '',
        timestamp: '上午9:30',
        type: 'document',
        document: {
          title: '2026PCG校园AI产品创意大赛参赛指南',
          subtitle: '仅可查看',
          icon: 'tencent-docs'
        }
      },
      {
        id: 'msg-1-2',
        senderId: 'admin-1',
        senderName: '赛事组委会',
        senderAvatar: '/avatars/group1.jpg',
        isAdmin: true,
        content: '@全体成员 欢迎参加2026年PCG校园AI产品创意大赛！请各参赛队伍仔细阅读参赛指南，按时提交作品。',
        timestamp: '上午9:32',
        type: 'text'
      },
      {
        id: 'msg-1-3',
        senderId: 'user-2',
        senderName: '创意小达人',
        senderAvatar: '/avatars/person1.jpg',
        content: '请问作品提交截止日期是什么时候？',
        timestamp: '上午9:45',
        type: 'text'
      },
      {
        id: 'msg-1-4',
        senderId: 'admin-1',
        senderName: '赛事组委会',
        senderAvatar: '/avatars/group1.jpg',
        isAdmin: true,
        content: '作品提交截止日期为5月15日晚上11:59，请大家合理安排时间。',
        timestamp: '上午9:50',
        type: 'text'
      },
      {
        id: 'msg-1-5',
        senderId: 'system',
        senderName: '系统消息',
        senderAvatar: '',
        content: '可盐可甜加入了群聊',
        timestamp: '上午10:01',
        type: 'system'
      }
    ]
  },
  {
    id: 'chat-2',
    name: '2022信息安全班群',
    avatar: '/avatars/group2.jpg',
    lastMessage: '许可: 这节课把学生证带来交一下',
    timestamp: '昨天 下午4:10',
    isMuted: false,
    memberCount: 65,
    isMutedAll: true,
    messages: [
      {
        id: 'msg-2-1',
        senderId: 'admin-yan',
        senderName: '信安 严一涛',
        senderAvatar: '/avatars/group2.jpg',
        isAdmin: true,
        content: '',
        timestamp: '上午9:00',
        type: 'document',
        document: {
          title: '2026年五一假期去向登记及请假外出学生情况汇总表（集...',
          subtitle: '编辑权限',
          icon: 'tencent-docs'
        }
      },
      {
        id: 'msg-2-2',
        senderId: 'admin-yan',
        senderName: '信安 严一涛',
        senderAvatar: '/avatars/group2.jpg',
        isAdmin: true,
        content: '劳动节的放假安排👉',
        timestamp: '上午10:30',
        type: 'link',
        link: {
          url: 'https://jwch.fzu.edu.cn/info/1036/14601.htm',
          text: '关于2026年劳动节放假课程调整的通知'
        }
      },
      {
        id: 'msg-2-3',
        senderId: 'admin-yan',
        senderName: '信安 严一涛',
        senderAvatar: '/avatars/group2.jpg',
        isAdmin: true,
        content: '@全体成员\n请大家及时填写五一假期去向，4.27日晚上八点前截止',
        timestamp: '上午11:00',
        type: 'text'
      },
      {
        id: 'msg-2-4',
        senderId: 'admin-xuke',
        senderName: '许可',
        senderAvatar: '/avatars/group3.jpg',
        isAdmin: true,
        content: '这节课把学生证带来交一下',
        timestamp: '昨天 下午4:10',
        type: 'quote',
        quote: {
          senderName: '102203148谢智...',
          content: '接杜领军老师通知：形势与政策课已经在系统里调整了上课的时间...',
          timestamp: '星期四 上午9:55'
        }
      }
    ]
  },
  {
    id: 'chat-3',
    name: '22级软信AI大数据年段群',
    avatar: '/avatars/group3.jpg',
    lastMessage: '信安_102203109_严一涛: @全体成员 请教务...',
    timestamp: '星期五',
    isMuted: false,
    memberCount: 245,
    messages: [
      {
        id: 'msg-3-1',
        senderId: 'admin-yan',
        senderName: '信安_102203109_严一涛',
        senderAvatar: '/avatars/group2.jpg',
        isAdmin: true,
        content: '@全体成员 请教务系统里还没选上体育课的同学尽快联系辅导员处理',
        timestamp: '星期五 上午8:30',
        type: 'text'
      },
      {
        id: 'msg-3-2',
        senderId: 'user-3',
        senderName: '软件_102203056_李明',
        senderAvatar: '/avatars/person1.jpg',
        content: '老师，我的选课系统显示冲突怎么办？',
        timestamp: '星期五 上午8:45',
        type: 'text'
      },
      {
        id: 'msg-3-3',
        senderId: 'admin-yan',
        senderName: '信安_102203109_严一涛',
        senderAvatar: '/avatars/group2.jpg',
        isAdmin: true,
        content: '选课冲突的同学请私聊我，我统一汇总后反馈给教务处',
        timestamp: '星期五 上午9:00',
        type: 'text'
      },
      {
        id: 'msg-3-4',
        senderId: 'user-4',
        senderName: 'AI_102203178_王小红',
        senderAvatar: '/avatars/group5.jpg',
        content: '收到，谢谢老师',
        timestamp: '星期五 上午9:05',
        type: 'text'
      }
    ]
  },
  {
    id: 'chat-4',
    name: 'lemontearab...',
    avatar: '/avatars/group4.jpg',
    lastMessage: '你们的初泛涟漪已熄灭。点击恢复',
    timestamp: '04/13',
    badges: ['🐷', '✅', '🐱', '🎒', '🐻', '💘', 'ARK'],
    isMuted: true,
    memberCount: 8,
    messages: [
      {
        id: 'msg-4-1',
        senderId: 'user-5',
        senderName: '柠檬茶',
        senderAvatar: '/avatars/group4.jpg',
        content: '今天天气真好，要不要出去玩？',
        timestamp: '04/13 上午10:00',
        type: 'text'
      },
      {
        id: 'msg-4-2',
        senderId: 'user-6',
        senderName: '小兔子',
        senderAvatar: '/avatars/person1.jpg',
        content: '好啊好啊！去哪里？',
        timestamp: '04/13 上午10:05',
        type: 'text'
      },
      {
        id: 'msg-4-3',
        senderId: 'user-5',
        senderName: '柠檬茶',
        senderAvatar: '/avatars/group4.jpg',
        content: '去公园野餐怎么样？',
        timestamp: '04/13 上午10:10',
        type: 'text'
      },
      {
        id: 'msg-4-4',
        senderId: 'system',
        senderName: '系统消息',
        senderAvatar: '',
        content: '你们的初泛涟漪已熄灭。点击恢复',
        timestamp: '04/13 下午3:00',
        type: 'system'
      }
    ]
  },
  {
    id: 'chat-5',
    name: '曦无厌夜',
    avatar: '/avatars/person1.jpg',
    lastMessage: '毕老师整体不怎么管的，还好挺宽松的我觉得',
    timestamp: '04/02',
    isMuted: false,
    messages: [
      {
        id: 'msg-5-1',
        senderId: 'user-1',
        senderName: 'Heartea',
        senderAvatar: '/avatars/user.jpg',
        content: '你们毕设导师怎么样啊？',
        timestamp: '04/02 下午2:00',
        type: 'text'
      },
      {
        id: 'msg-5-2',
        senderId: 'user-7',
        senderName: '曦无厌夜',
        senderAvatar: '/avatars/person1.jpg',
        content: '毕老师整体不怎么管的，还好挺宽松的我觉得',
        timestamp: '04/02 下午2:15',
        type: 'text'
      },
      {
        id: 'msg-5-3',
        senderId: 'user-1',
        senderName: 'Heartea',
        senderAvatar: '/avatars/user.jpg',
        content: '那挺好的，自由度高',
        timestamp: '04/02 下午2:20',
        type: 'text'
      },
      {
        id: 'msg-5-4',
        senderId: 'user-7',
        senderName: '曦无厌夜',
        senderAvatar: '/avatars/person1.jpg',
        content: '是的，但是得自己把控进度',
        timestamp: '04/02 下午2:25',
        type: 'text'
      }
    ]
  },
  {
    id: 'chat-6',
    name: '软学小群',
    avatar: '/avatars/group5.jpg',
    lastMessage: '你关闭了定时禁言',
    timestamp: '03/29',
    isMuted: true,
    memberCount: 12,
    messages: [
      {
        id: 'msg-6-1',
        senderId: 'user-8',
        senderName: '学习委员',
        senderAvatar: '/avatars/group5.jpg',
        isAdmin: true,
        content: '明天有线性代数测验，大家复习一下',
        timestamp: '03/29 上午9:00',
        type: 'text'
      },
      {
        id: 'msg-6-2',
        senderId: 'user-9',
        senderName: '小明同学',
        senderAvatar: '/avatars/person1.jpg',
        content: '范围是什么？',
        timestamp: '03/29 上午9:10',
        type: 'text'
      },
      {
        id: 'msg-6-3',
        senderId: 'user-8',
        senderName: '学习委员',
        senderAvatar: '/avatars/group5.jpg',
        isAdmin: true,
        content: '第一章到第三章',
        timestamp: '03/29 上午9:15',
        type: 'text'
      },
      {
        id: 'msg-6-4',
        senderId: 'system',
        senderName: '系统消息',
        senderAvatar: '',
        content: '你关闭了定时禁言',
        timestamp: '03/29 下午6:00',
        type: 'system'
      }
    ]
  },
  {
    id: 'chat-7',
    name: '花田的考研夸夸群',
    avatar: '/avatars/group6.jpg',
    lastMessage: '真的燃尽了: 目前没看到',
    timestamp: '上午10:11',
    unreadCount: 1,
    isMuted: true,
    memberCount: 89,
    messages: [
      {
        id: 'msg-7-1',
        senderId: 'user-10',
        senderName: '加油鸭',
        senderAvatar: '/avatars/group6.jpg',
        content: '大家今天学习了多久呀？',
        timestamp: '上午8:00',
        type: 'text'
      },
      {
        id: 'msg-7-2',
        senderId: 'user-11',
        senderName: '冲冲冲',
        senderAvatar: '/avatars/person1.jpg',
        content: '已经学了3个小时了！继续加油！',
        timestamp: '上午9:30',
        type: 'text'
      },
      {
        id: 'msg-7-3',
        senderId: 'user-12',
        senderName: '花田',
        senderAvatar: '/avatars/group6.jpg',
        isAdmin: true,
        content: '有没有人看到今年的考纲变化？',
        timestamp: '上午10:00',
        type: 'text'
      },
      {
        id: 'msg-7-4',
        senderId: 'user-13',
        senderName: '真的燃尽了',
        senderAvatar: '/avatars/group5.jpg',
        content: '目前没看到',
        timestamp: '上午10:11',
        type: 'text'
      }
    ]
  },
  {
    id: 'chat-8',
    name: '王道27北京工业计算机/软件...',
    avatar: '/avatars/group7.jpg',
    lastMessage: '左边，右边: [图片]',
    timestamp: '上午10:11',
    unreadCount: 21,
    isMuted: true,
    memberCount: 356,
    messages: [
      {
        id: 'msg-8-1',
        senderId: 'admin-wang',
        senderName: '王道官方',
        senderAvatar: '/avatars/group7.jpg',
        isAdmin: true,
        content: '',
        timestamp: '上午8:00',
        type: 'document',
        document: {
          title: '2027年北京工业大学计算机考研复习规划',
          subtitle: '仅可查看',
          icon: 'tencent-docs'
        }
      },
      {
        id: 'msg-8-2',
        senderId: 'admin-wang',
        senderName: '王道官方',
        senderAvatar: '/avatars/group7.jpg',
        isAdmin: true,
        content: '@全体成员 新一期的复习规划已经发布，请大家查看并制定自己的学习计划',
        timestamp: '上午8:05',
        type: 'text'
      },
      {
        id: 'msg-8-3',
        senderId: 'user-14',
        senderName: '考研小白',
        senderAvatar: '/avatars/person1.jpg',
        content: '请问408的复习顺序是什么？',
        timestamp: '上午9:00',
        type: 'text'
      },
      {
        id: 'msg-8-4',
        senderId: 'user-15',
        senderName: '学长助攻',
        senderAvatar: '/avatars/group5.jpg',
        content: '建议先数据结构，再操作系统，然后计组，最后网络',
        timestamp: '上午9:30',
        type: 'text'
      },
      {
        id: 'msg-8-5',
        senderId: 'user-16',
        senderName: '左边，右边',
        senderAvatar: '/avatars/group4.jpg',
        content: '[图片]',
        timestamp: '上午10:11',
        type: 'image'
      }
    ]
  }
]
