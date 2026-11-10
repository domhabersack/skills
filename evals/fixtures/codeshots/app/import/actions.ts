'use server'

import { rateLimits } from '@/src/config'
import { rateLimit } from '@/src/lib/rate-limit'

export async function importSnippets(formData: FormData) {
  const accountId = String(formData.get('accountId'))
  if (!(await rateLimit(`import:${accountId}`, rateLimits.import))) {
    return { error: 'Too many imports. Try again in an hour.' }
  }
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return { error: 'Choose a file to import.' }
  }
  // TODO: parse CSV rows into snippets
  return { imported: 0 }
}
