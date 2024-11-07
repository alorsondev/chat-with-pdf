import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'

import { getDatabaseClient } from './1-getDatabaseClient'
import { getVectorStore } from './3-embedAndStoreDocs'
import { returnReadableStream } from './utils'

type GetChatAnswerParams = {
  question: string
  chatHistory: string
}

const getChatAnswer = async ({ question, chatHistory }: GetChatAnswerParams) => {
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ')
  const databaseClient = await getDatabaseClient()
  const vectorStore = await getVectorStore(databaseClient)

  // 1 - GENERATE SEARCH QUERY AND RETRIEVE DOCUMENTS
  const generateSearchQueryPrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder('chat_history'),
    ['user', '{input}'],
    [
      'user',
      'Given above conversation, generate a search query to look up in order to get information relevant to the conversation.',
    ],
  ])

  const generateSearchQueryModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.AI_PROVIDER_API_KEY,
    model: 'gemini-1.5-pro',
    temperature: 0,
    maxRetries: 2,
    maxOutputTokens: 1500,
  })

  // Steps of this chain:
  // 1 - prompt is passed to the llm (model)
  // 2 - llm generates a search query
  // 3 - retriever uses the search query and retrieves matching documents in database
  const retrieveDocumentsChain = await createHistoryAwareRetriever({
    rephrasePrompt: generateSearchQueryPrompt,
    llm: generateSearchQueryModel,
    retriever: vectorStore.asRetriever(),
  })

  // 2 - PASS DOCUMENTS TO ANSWERING MODEL
  const passDocumentsAndAnsweringRequirementsPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a helpful assistant. Answer user's question exclusively based on following context : {context}, in a simple way. 
      Don;t try to give imaginary answers, if you don;t know something just say, sorry I don't know.`,
    ],

    new MessagesPlaceholder('chat_history'),

    ['user', '{input}'],
  ])

  const generateAnswerModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.AI_PROVIDER_API_KEY,
    model: 'gemini-1.5-pro',
    temperature: 0,
    streaming: true,
    maxRetries: 2,
  })

  // This chain passes the retrieved documents to the answering model
  const passDocumentsToAnsweringModelChain = await createStuffDocumentsChain({
    prompt: passDocumentsAndAnsweringRequirementsPrompt,
    llm: generateAnswerModel,
  })

  // This chains connects chains 1 & 2, in order to:
  // 1 - GENERATE SEARCH QUERY AND RETRIEVE DOCUMENTS
  // 2 - PASS RETRIEVED DOCUMENTS TO ANSWERING MODEL
  const retrieveDocumentsAndPassThemToAnsweringModelChain = await createRetrievalChain({
    retriever: retrieveDocumentsChain,
    combineDocsChain: passDocumentsToAnsweringModelChain,
  })

  // gets the answer from the model, which is an iterable stream
  const iterableStream = await retrieveDocumentsAndPassThemToAnsweringModelChain.stream({
    chat_history: chatHistory,
    input: sanitizedQuestion,
  })

  // converts iterable stream into a classic readable stream, and returns it
  const readableStream = await returnReadableStream(iterableStream)

  return new Response(readableStream)
}

export { getChatAnswer }
