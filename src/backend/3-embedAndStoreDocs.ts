import { Pinecone } from '@pinecone-database/pinecone'
import { PineconeStore } from '@langchain/pinecone'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { TaskType } from '@google/generative-ai'

const embedAndStoreDocs = async (
  client: Pinecone,
  /* @ts-ignore docs type error */
  docs: Document<Record<string, any>>
) => {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.AI_PROVIDER_API_KEY,
    model: 'text-embedding-004',
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: 'Réussir ses tests techniques en développement web',
  })

  const databaseIndex: any = client.Index(process.env.DATABASE_INDEX_NAME!)

  await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex: databaseIndex,
    textKey: 'text',
  })
}

const getVectorStore = async (client: Pinecone) => {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.AI_PROVIDER_API_KEY,
    model: 'text-embedding-004',
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: 'Réussir ses tests techniques en développement web',
  })

  const databaseIndex: any = client.Index(process.env.DATABASE_INDEX_NAME!)

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: databaseIndex,
    textKey: 'text',
  })

  return vectorStore
}

export { embedAndStoreDocs, getVectorStore }
