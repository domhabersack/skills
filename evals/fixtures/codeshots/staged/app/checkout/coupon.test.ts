import { describe, expect, it } from 'vitest'
import { applyCoupon, isValidCoupon } from './coupon'

describe('isValidCoupon', () => {
  it('rejects malformed codes', () => {
    expect(isValidCoupon({ code: 'x', percentOff: 10 })).toBe(false)
  })

  it('rejects expired coupons', () => {
    const expiresAt = new Date('2020-01-01')
    expect(isValidCoupon({ code: 'SAVE10', percentOff: 10, expiresAt })).toBe(false)
  })
})

describe('applyCoupon', () => {
  it('ignores invalid coupons', () => {
    expect(applyCoupon(1000, { code: 'x', percentOff: 10 })).toBe(1000)
  })
})
