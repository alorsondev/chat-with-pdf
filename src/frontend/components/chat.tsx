'use client'

import { useEffect, useRef } from 'react'
import { useChat, Message } from 'ai/react'

import { scrollToBottom, initialMessages } from '@/frontend/utils'

import { Button } from '@/frontend/components/ui/button'
import { Input } from '@/frontend/components/ui/input'
import { ChatLine } from './chat-line'
import { Spinner } from './ui/spinner'

export function Chat() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const useChatHelpers = useChat({
    initialMessages,
    streamProtocol: 'text',
  })

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChatHelpers

  useEffect(() => {
    setTimeout(() => scrollToBottom(containerRef), 100)
  }, [messages])

  return (
    <div className="rounded-2xl border h-[75vh] flex flex-col justify-between">
      <div className="p-6 overflow-auto" ref={containerRef}>
        {messages.map(({ id, role, content }: Message) => (
          <ChatLine key={id} role={role} content={content} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 flex clear-both">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Tapez votre question"
          className="mr-2"
        />

        <Button type="submit" className="w-24">
          {isLoading ? <Spinner /> : 'Ask'}
        </Button>
      </form>
    </div>
  )
}
