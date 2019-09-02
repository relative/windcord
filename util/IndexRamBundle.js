const MAGIC_NUMBER = require('metro/src/shared/output/RamBundle/magic-number')

// Adapted from https://github.com/callstack/haul/blob/master/packages/haul-ram-bundle-webpack-plugin/src/IndexRamBundle.ts

/***
 * Reference: https://github.com/facebook/metro/blob/master/packages/metro/src/shared/output/RamBundle/as-indexed-file.js
 */

const NULL_TERMINATOR = Buffer.alloc(1).fill(0)
const UNIT32_SIZE = 4

module.exports = class IndexRamBundle {
  constructor(bootstrap, modules) {
    this.encoding = 'utf8'
    this.header = Buffer.alloc(4)
    this.bootstrap = Buffer.alloc(0)
    this.toc = Buffer.alloc(0)
    this.modules = []
    this.rawModules = []

    this.bootstrap = this.toNullTerminatedBuffer(bootstrap)
    this.rawModules = modules
    this.modules = modules.map(m => ({
      id: typeof m.id === 'string' ? m.idx : m.id,
      buffer: this.toNullTerminatedBuffer(m.source)
    }))
    this.header.writeUInt32LE(MAGIC_NUMBER, 0)
  }

  toNullTerminatedBuffer(body) {
    return Buffer.concat([Buffer.from(body, 'utf8'), NULL_TERMINATOR])
  }

  getOffset(n) {
    return (2 + n * 2) * UNIT32_SIZE
  }

  buildToc() {
    const maxModuleId = Math.max(...this.modules.map(m => m.id))
    const entriesLength = maxModuleId + 1
    const table = Buffer.alloc(this.getOffset(entriesLength)).fill(0)

    table.writeUInt32LE(entriesLength, 0)
    table.writeUInt32LE(this.bootstrap.length, UNIT32_SIZE)

    let codeOffset = this.bootstrap.length
    this.modules.forEach(moduleBuffer => {
      const offset = this.getOffset(moduleBuffer.id)
      table.writeUInt32LE(codeOffset, offset)
      table.writeUInt32LE(moduleBuffer.buffer.length, offset + UNIT32_SIZE)
      codeOffset += moduleBuffer.buffer.length
    })

    this.toc = table
  }

  build() {
    this.buildToc()

    const bundle = Buffer.concat(
      [this.header, this.toc, this.bootstrap].concat(
        this.modules.map(m => m.buffer)
      )
    )
    return bundle
  }
}
