import Balancer from 'react-wrap-balancer'
import { Message } from 'ai/react'

import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/card'

const convertNewLines = (text: string) =>
  text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ))

export function ChatLine({ role = 'assistant', content }: Pick<Message, 'role' | 'content'>) {
  if (!content) {
    return null
  }

  const formattedMessage = convertNewLines(content)

  return (
    <div>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle
            className={
              role != 'assistant'
                ? 'text-amber-500 dark:text-amber-200'
                : 'text-blue-500 dark:text-blue-200'
            }
          >
            {role == 'assistant' ? 'Assistant IA' : 'Vous'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <Balancer>{formattedMessage}</Balancer>
        </CardContent>
      </Card>
    </div>
  )
}
