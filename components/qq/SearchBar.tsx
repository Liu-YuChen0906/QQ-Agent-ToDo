'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = '搜索' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch?.(value)
  }
  
  return (
    <div className="px-4 py-2">
      <div 
        className={`
          flex items-center gap-2 px-4 py-2.5 
          bg-muted/50 rounded-lg
          transition-all duration-200
          ${isFocused ? 'ring-2 ring-ring' : ''}
        `}
      >
        <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-base focus:outline-none"
          aria-label="搜索聊天"
        />
      </div>
    </div>
  )
}
