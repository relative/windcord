const RamBundleParser = require('metro/src/lib/RamBundleParser')

module.exports = class RamBundle {
  /**
   * Constructor
   *
   * @param {Buffer} file
   */
  constructor(file) {
    this.file = file

    this.bundle = new RamBundleParser(file)

    this.numModules = this.bundle._numModules
    this.startupCodeLength = this.bundle._startupCodeLength
  }

  /**
   * Get startup code
   * @returns {string}
   */
  getStartupCode() {
    return this.bundle.getStartupCode()
  }

  /**
   * Get a module from the module ID
   * @param {Number} id
   * @returns {string}
   */
  getModule(id) {
    return this.bundle.getModule(id)
  }
}
