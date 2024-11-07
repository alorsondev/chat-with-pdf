import { IterableReadableStream } from '@langchain/core/utils/stream'

export function iteratorToReadableStream(iterator: AsyncGenerator<Uint8Array, void, unknown>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

export async function* makeIterator(
  result: IterableReadableStream<
    /* @ts-ignore docs type error */
    { context: Document<Record<string, any>>[]; answer: string } & { [key: string]: unknown }
  >
) {
  const encoder = new TextEncoder()

  for await (const chunk of result) {
    if (chunk.answer) yield encoder.encode(chunk.answer)
  }
}

export async function returnReadableStream(
  iterableStream: IterableReadableStream<
    /* @ts-ignore docs type error */
    { context: Document<Record<string, any>>[]; answer: string } & { [key: string]: unknown }
  >
) {
  const iterator = makeIterator(iterableStream)
  const readableStream = iteratorToReadableStream(iterator)
  return readableStream
}
