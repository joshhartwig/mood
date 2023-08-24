import { OpenAI } from 'langchain/llms/openai'
import {
  StructuredOutputParser,
  OutputFixingParser,
} from 'langchain/output_parsers'
import z from 'zod'
import { PromptTemplate } from 'langchain/prompts'
import { Document } from 'langchain/document'
import { loadQARefineChain } from 'langchain/chains'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe('The mood of the person who wrote the jounral entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    summary: z
      .string()
      .describe('A quick summary of the entire entry, in one sentence.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions?)'
      ),
    color: z
      .string()
      .describe(
        'a hexadecimal color code that represents the mood of the journal entry. Example #0101fe for blue represents a happy mood.'
      ),
  })
)

export const analyze = async (content: string) => {
  const input = await getPrompt(content)
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
  const result = await model.call(input as string)

  try {
    return parser.parse(result)
  } catch (e) {
    console.log(e)
  }
}

export const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions()
  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  })

  const input = await prompt.format({ entry: content })

  return input
}

export const qa = async (question, entries) => {
  const docs = entries.map(
    (entry) =>
      new Document({
        pageContent: entry.content,
        metadata: { source: entry.id, date: entry.createdAt },
      })
  )

  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' }) // model is used to answer the question
  const chain = loadQARefineChain(model) // chain is used to refine the answer to the question
  const embeddings = new OpenAIEmbeddings() // embeddings are used to find the most similar document to the question
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings) // store is used to find the most similar document to the question

  const relevantDocs = await store.similaritySearch(question) // find the most similar document to the question

  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  })

  return res.output_text
}
