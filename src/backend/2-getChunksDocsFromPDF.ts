import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

const pdfPath = process.env.PDF_PATH!

const getChunkedDocsFromPDF = async () => {
  const loader = new PDFLoader(pdfPath)

  const docs = await loader.load()

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const chunkedDocs = await textSplitter.splitDocuments(docs)

  return chunkedDocs
}

export { getChunkedDocsFromPDF }
