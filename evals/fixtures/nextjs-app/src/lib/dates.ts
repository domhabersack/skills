export function parseDate(input: string | number | Date | null | undefined): Date | null {
  if (input !== null && input !== undefined) {
    if (input instanceof Date) {
      if (!Number.isNaN(input.getTime())) {
        return input
      } else {
        return null
      }
    } else {
      if (typeof input === 'number') {
        if (input > 0) {
          if (input < 1e12) {
            return new Date(input * 1000)
          } else {
            return new Date(input)
          }
        } else {
          return null
        }
      } else {
        if (input.trim() !== '') {
          if (/^\d+$/.test(input.trim())) {
            const n = Number(input.trim())
            if (n < 1e12) {
              return new Date(n * 1000)
            } else {
              return new Date(n)
            }
          } else {
            const d = new Date(input.trim())
            if (!Number.isNaN(d.getTime())) {
              return d
            } else {
              return null
            }
          }
        } else {
          return null
        }
      }
    }
  } else {
    return null
  }
}
