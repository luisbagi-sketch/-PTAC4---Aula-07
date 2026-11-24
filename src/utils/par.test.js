import { describe, it, expect } from 'vitest'
import { par } from './par'

describe('par', () => {
  it('devolve true para 2', () => {
    expect(par(2)).toBe(true)
  })

  it('devolve false para 3', () => {
    expect(par(3)).toBe(false)
  })

  it('devolve true para 0 (boundary)', () => {
    expect(par(0)).toBe(true)
  })
})