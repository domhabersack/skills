export type Coupon = { code: string; percentOff: number; expiresAt?: Date }

export function isValidCoupon(coupon: Coupon, now = new Date()): boolean {
  if (!/^[A-Z0-9]{4,12}$/.test(coupon.code)) return false
  if (coupon.percentOff <= 0 || coupon.percentOff > 100) return false
  return !coupon.expiresAt || coupon.expiresAt > now
}

export function applyCoupon(totalCents: number, coupon: Coupon | null): number {
  if (!coupon || !isValidCoupon(coupon)) return totalCents
  return Math.round(totalCents * (1 - coupon.percentOff / 100))
}
