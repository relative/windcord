const IndexRamBuffer = require('../util/IndexRamBundle'),
  path = require('path'),
  fs = require('fs-extra')

const {
  paths: { STAGE_PATH, DIST_PATH, OUT_PATH },
  hash
} = require('../util/Constants')

const mappings = require(path.join(OUT_PATH, 'mappings.json'))
const modules = []

console.log('[ .. ]\tbuilding rambundle')

Object.keys(mappings.moduleMappings.resolvedPaths).forEach(key => {
  let id = mappings.moduleMappings.resolvedPaths[key]
  let source = fs.readFileSync(key, 'utf8')
  modules.push({
    id,
    source
  })
})

const bootstrap = fs.readFileSync(path.join(OUT_PATH, 'bootstrap.js'), 'utf8')
const entry = fs.readFileSync(path.join(OUT_PATH, 'entry.js'), 'utf8')

modules.push({
  id: 0,
  source: entry
})
const bundle = new IndexRamBuffer(bootstrap, modules)
let built = bundle.build()
console.log('[ ok ]\trambundle built')
fs.writeFileSync(path.join(DIST_PATH, 'main.jsbundle'), built)
console.log('[ ok ]\twrote rambundle to disk at dist/main.jsbundle')

console.log('[ .. ]\tcreating manifest')
const manifest = require(path.join(STAGE_PATH, 'manifest.json'))
manifest.hashes['main.jsbundle'] = hash(built)
console.log('[ .. ]\trewrote manifest hashes')
fs.writeFileSync(
  path.join(DIST_PATH, 'manifest.json'),
  JSON.stringify(manifest),
  'utf8'
)
console.log('[ ok ]\twrote manifest to disk at dist/manifest.json')
console.log('complete!')
console.log('run "yarn push" to push bundle to device')
