const Client = require('ssh2-sftp-client'),
  path = require('path')

const {
  paths: { STAGE_PATH },
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
  console.log('[ .. ]\tpulling main.jsbundle')
  await sftp.fastGet(
    `${APP_PATH}/main.jsbundle`,
    path.resolve(STAGE_PATH, 'main.jsbundle')
  )
  console.log('[ ok ]\tpulled main.jsbundle')
  console.log('[ .. ]\tpulling manifest.json')
  await sftp.fastGet(
    `${APP_PATH}/manifest.json`,
    path.resolve(STAGE_PATH, 'manifest.json')
  )
  console.log('[ ok ]\tpulled manifest.json')
  await sftp.end()
  console.log('complete!')
}

main()
