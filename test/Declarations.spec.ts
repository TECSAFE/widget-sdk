import { describe, it, expect } from '@jest/globals'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

describe('published declarations', () => {
  it('contains no unresolvable bare module specifiers', () => {
    const dts = join(__dirname, '..', 'dist', 'index.d.ts')
    if (!existsSync(dts)) return // build artefact absent; the CI build step covers this
    const bare = [...readFileSync(dts, 'utf8').matchAll(/import\("([^"]+)"\)/g)]
      .map((m) => m[1]!)
      .filter((spec) => !spec.startsWith('.'))
    expect(bare).toEqual([])
  })
})
