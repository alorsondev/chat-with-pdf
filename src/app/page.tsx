import { Chat } from '@/frontend/components/chat'
import { DarkModeToggle } from '@/frontend/components/dark-mode-toggle'

export default function Home() {
  return (
    <main className="relative container flex min-h-screen flex-col">
      <div className=" p-4 flex h-14 items-center justify-between supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <span className="font-bold">First AI chat</span>
        <DarkModeToggle />
      </div>

      <div className="flex flex-1 py-4">
        <div className="w-full">
          <Chat />
        </div>
      </div>
    </main>
  )
}
