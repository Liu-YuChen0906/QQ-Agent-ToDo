'use client'

import { Monitor, ChevronRight } from 'lucide-react'

interface DeviceLoginBarProps {
  deviceType?: 'windows' | 'mac' | 'mobile'
  onClick?: () => void
}

export function DeviceLoginBar({ deviceType = 'windows', onClick }: DeviceLoginBarProps) {
  const deviceLabel = deviceType === 'windows' ? 'Windows' : deviceType === 'mac' ? 'Mac' : '手机'
  
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
      aria-label={`已登录${deviceLabel}设备`}
    >
      <div className="flex items-center gap-3">
        <Monitor className="w-5 h-5 text-muted-foreground" />
        <span className="text-muted-foreground text-base">已登录{deviceLabel}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  )
}
