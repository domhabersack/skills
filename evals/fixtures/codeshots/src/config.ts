// Requests allowed per window, per API key, IP address or account.
export const rateLimits = {
  render: { limit: 60, windowSeconds: 60 },
  import: { limit: 5, windowSeconds: 3600 },
}
