'use server'

export async function importTasks(formData: FormData) {
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return { error: 'Choose a file to import.' }
  }
  // TODO: parse CSV rows into tasks
  return { imported: 0 }
}
