const RamBundle = require('../util/RamBundle'),
  crypto = require('crypto'),
  path = require('path'),
  fs = require('fs-extra')
const {
  DEBUNDLE_BOOTSTRAP_SIG,
  paths: { BUNDLE_PATH, OUT_PATH }
} = require('../util/Constants')

const bufBundle = fs.readFileSync(BUNDLE_PATH)
const bundle = new RamBundle(bufBundle)

let bootstrap = bundle.getStartupCode()
let sigIndex = bootstrap.indexOf(DEBUNDLE_BOOTSTRAP_SIG)
bootstrap = bootstrap.substr(sigIndex + DEBUNDLE_BOOTSTRAP_SIG.length)
bootstrap = bootstrap.substr(0, bootstrap.length - 3)
const mappings = JSON.parse(eval(`JSON.stringify(${bootstrap})`)) // unsafe
const ourMappings = {}
const resolvedPaths = {}
Object.keys(mappings.modules).forEach(key => {
  const value = mappings.modules[key]
  let ourKey = key.replace(/\.\.\//gi, './')
  ourKey = ourKey.replace('^\\.\\/.*$', 'regexthing')
  ourMappings[ourKey] = [key, value]
})
mappings.ourModules = ourMappings

Object.keys(mappings.ourModules).forEach(key => {
  let value = mappings.ourModules[key]
  let original = value[0]
  let id = value[1]
  let resolvedPath = path.resolve(path.join(OUT_PATH, key))

  fs.mkdirpSync(path.dirname(resolvedPath))
  fs.writeFileSync(resolvedPath, bundle.getModule(id), 'utf8')
  resolvedPaths[resolvedPath] = id
})
mappings.resolvedPaths = resolvedPaths
// Write bootstrap to disk
fs.writeFileSync(
  path.join(OUT_PATH, 'bootstrap.js'),
  bundle.getStartupCode(),
  'utf8'
)

// Write mappings
fs.writeFileSync(
  path.join(OUT_PATH, 'mappings.json'),
  JSON.stringify(mappings, null, 2),
  'utf8'
)

// Write entry
fs.writeFileSync(path.join(OUT_PATH, 'entry.js'), bundle.getModule(0), 'utf8')
