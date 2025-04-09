import {OpenAI} from 'openai'

const openai = new OpenAI({
  apiKey: process.env.SANITY_STUDIO_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

type TranslateInput = {
  input: {
    title: string
    body: any // assuming PortableTextBlock[] or string
  }
  from: string
  to: string
}

export async function translateWithOpenAI({input, from, to}: TranslateInput): Promise<{
  title: string
  body: any
}> {
  const prompt = `Translate the following content from ${from} to ${to}. Keep formatting like Markdown or Portable Text:

Title:
${input.title}

Body:
${typeof input.body === 'string' ? input.body : JSON.stringify(input.body)}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a professional translator who preserves style, tone, and formatting.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
  })

  const text = response.choices[0]?.message?.content || ''

  const [title, ...bodyLines] = text.split('\n\n')

  return {
    title: title.replace(/^Title:\s*/, '').trim(),
    body: bodyLines
      .join('\n\n')
      .replace(/^Body:\s*/i, '')
      .trim(),
  }
}
