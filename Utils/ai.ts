import { OpenAI } from 'langchain/llms/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import z from 'zod'
import { PromptTemplate } from 'langchain/prompts'

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
      'Analyze the following journal entry. Follow the intrusctions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  })

  const input = await prompt.format({ entry: content })

  return input
}

const qa = async () => {}
