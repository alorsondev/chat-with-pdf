import { getChunkedDocsFromPDF } from '@/backend/2-getChunksDocsFromPDF'
import { getDatabaseClient } from '@/backend/1-getDatabaseClient'
import { embedAndStoreDocs } from '@/backend/3-embedAndStoreDocs'

const initDatabaseClientChunkAndEmbedDocsAndStoreInDatabase = async () => {
  const databaseClient = await getDatabaseClient()

  const chunkedDocs = await getChunkedDocsFromPDF()

  await embedAndStoreDocs(databaseClient, chunkedDocs)
}

// hit `npm run prepare:data` in terminal, to call this function and store docs in database
initDatabaseClientChunkAndEmbedDocsAndStoreInDatabase()
