export type Coupon = { code: string; percentOff: number }

export function applyCoupon(totalCents: number, coupon: Coupon | null): number {
  if (!coupon) return totalCents
  return Math.round(totalCents * (1 - coupon.percentOff / 100))
}
