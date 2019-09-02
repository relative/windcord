const Client = require('ssh2-sftp-client'),
  path = require('path'),
  fs = require('fs-extra')

const {
  paths: { DIST_PATH },
  device: {
    IP: DEVICE_IP,
    PASSWORD: DEVICE_PASSWORD,
    APP_PATH,
    USERNAME: DEVICE_USERNAME
  }
} = require('../util/Constants')

async function main() {
  const sftp = new Client()
  console.log('[ .. ]\tconnecting to device')
  await sftp.connect({
    host: DEVICE_IP,
    port: 22,
    username: DEVICE_USERNAME,
    password: DEVICE_PASSWORD
  })
  console.log('[ ok ]\tconnected to device')
  console.log('[ .. ]\tpushing main.jsbundle')
  await sftp.fastPut(
    path.resolve(DIST_PATH, 'main.jsbundle'),
    `${APP_PATH}/main.jsbundle`
  )
  console.log('[ ok ]\tpushed main.jsbundle')
  console.log('[ .. ]\tpushing manifest.json')
  await sftp.fastPut(
    path.resolve(DIST_PATH, 'manifest.json'),
    `${APP_PATH}/manifest.json`
  )
  console.log('[ ok ]\tpushed manifest.json')
  await sftp.end()
  console.log('complete!')
  console.log('kill Discord in your app switcher and restart Discord')
}

main()
