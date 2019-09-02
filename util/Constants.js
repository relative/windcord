const dotenv = require('dotenv'),
  crypto = require('crypto'),
  path = require('path')
dotenv.config()

const BASE_PATH = path.resolve(
  process.env.BASE_PATH || path.join(__dirname, '..')
)
const STAGE_PATH = path.resolve(BASE_PATH, 'stage')
const OUT_PATH = path.resolve(BASE_PATH, 'out')
const DIST_PATH = path.resolve(BASE_PATH, 'dist')
const BUNDLE_PATH = path.join(STAGE_PATH, 'main.jsbundle')

module.exports = {
  DEBUNDLE_BOOTSTRAP_SIG: `/*****/  })(this, `,
  paths: {
    BASE_PATH,
    STAGE_PATH,
    OUT_PATH,
    DIST_PATH,
    BUNDLE_PATH
  },
  device: {
    IP: process.env.DEVICE_IP,
    USERNAME: process.env.DEVICE_USER,
    PASSWORD: process.env.DEVICE_PASS,
    APP_PATH: process.env.APP_PATH
  },
  hash: buffer => {
    let hash = crypto.createHash('md5')
    hash.update(buffer)
    return hash.digest('hex')
  }
}
