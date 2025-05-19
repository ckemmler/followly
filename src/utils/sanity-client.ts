import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'd7z4iom2',
  dataset: 'production',
  apiVersion: '2025-05-15',
  useCdn: true,
})

export default client