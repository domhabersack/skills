// Calls fn at most once every waitMs, for scroll and resize handlers.
export function throttle<T extends unknown[]>(fn: (...args: T) => void, waitMs: number) {
  let last = 0
  return (...args: T) => {
    const now = Date.now()
    if (now - last >= waitMs) {
      last = now
      fn(...args)
    }
  }
}
