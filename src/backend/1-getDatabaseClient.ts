import { Pinecone } from '@pinecone-database/pinecone'

// Make sure to have created an index on database website (pinecone.io) before
export async function getDatabaseClient() {
  try {
    const databaseClient = new Pinecone({
      apiKey: process.env.DATABASE_API_KEY!,
    })

    return databaseClient
  } catch (error) {
    console.error('error', error)
    throw new Error('Failed to initialize Pinecone Client')
  }
}
