'use server'

export async function importSnippets(formData: FormData) {
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return { error: 'Choose a file to import.' }
  }
  // TODO: parse CSV rows into snippets
  return { imported: 0 }
}
