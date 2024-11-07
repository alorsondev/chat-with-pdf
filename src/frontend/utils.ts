import { Message } from 'ai'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Default UI Message
export const initialMessages: Message[] = [
  {
    role: 'assistant',
    id: '0',
    content: `Hello ! Posez-moi toutes vos questions sur le livre "Réussir ses tests techniques en développement web".
      
      Exemples : 
      
      - En quoi consiste le contenu du livre ?

      - Quelles sont les étapes de réalisation d'un test technique abordées dans le livre ?
      
      - Que dit le livre sur les tests unitaires ?

      - Que dit le livre sur la gestion de state ?

      - Le livre peut-il m'aider même une fois en entreprise, ou en tant que freelance ?
    `,
  },
]

export function scrollToBottom(containerRef: React.RefObject<HTMLElement>) {
  if (containerRef.current) {
    const lastMessage = containerRef.current.lastElementChild
    if (lastMessage) {
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: 'smooth',
        block: 'end',
      }
      lastMessage.scrollIntoView(scrollOptions)
    }
  }
}
