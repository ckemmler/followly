export const apiVersion = process.env.SANITY_STUDIO_SANITY_API_VERSION || '2025-04-09'

export const dataset = assertValue(
  process.env.SANITY_STUDIO_SANITY_DATASET,
  'Missing environment variable: SANITY_STUDIO_SANITY_DATASET',
)
export const apiKey = assertValue(
  process.env.SANITY_STUDIO_SANITY_API_KEY,
  'Missing environment variable: SANITY_STUDIO_SANITY_API_KEY',
)
export const projectId = assertValue(
  process.env.SANITY_STUDIO_SANITY_PROJECT_ID,
  'Missing environment variable: SANITY_STUDIO_SANITY_PROJECT_ID',
)
export const openaiApi = assertValue(
  process.env.SANITY_STUDIO_OPENAI_API_KEY,
  'Missing environment variable: SANITY_STUDIO_OPENAI_API_KEY',
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
