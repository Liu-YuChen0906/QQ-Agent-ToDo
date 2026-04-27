'use client'

import { Battery, Signal, Wifi } from 'lucide-react'

interface StatusBarProps {
  time?: string
  batteryLevel?: number
  networkType?: string
}

export function StatusBar({ 
  time = '10:11', 
  batteryLevel = 91,
  networkType = '5G'
}: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-2 text-foreground">
      <span className="text-base font-semibold">{time}</span>
      
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className="w-1 rounded-sm bg-foreground"
              style={{ height: `${bar * 3 + 4}px` }}
            />
          ))}
        </div>
        
        <span className="text-sm font-medium ml-1">{networkType}</span>
        
        <div className="flex items-center gap-1 ml-1">
          <div className="relative flex items-center">
            <div className="w-7 h-3.5 rounded-sm border border-foreground flex items-center p-0.5">
              <div 
                className="h-full rounded-xs bg-foreground"
                style={{ width: `${batteryLevel}%` }}
              />
            </div>
            <div className="w-0.5 h-1.5 bg-foreground rounded-r-sm ml-0.5" />
          </div>
          <span className="text-xs font-medium">{batteryLevel}</span>
        </div>
      </div>
    </div>
  )
}
