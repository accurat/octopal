require('dotenv').config()
const Webstore = require('chrome-webstore-upload')
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const refreshToken = process.env.REFRESH_TOKEN

if (!clientId || !clientSecret || !refreshToken) {
  console.log('Missing configuration')
  process.exit(1)
  return
}

const { execSync } = require('child_process')
const { createReadStream } = require('fs')

const webStore = Webstore({
  extensionId: 'bgaoaeaaplebihikpnlloglbpficgopi',
  clientId,
  clientSecret,
  refreshToken,
})

async function publish() {
  execSync('zip -r ./build.zip build')
  const zippedPackage = createReadStream('./build.zip')

  const token = await webStore.fetchToken()

  await webStore.uploadExisting(zippedPackage, token)
  console.log('Extension uploaded')

  await webStore.publish('default', token)
  console.log('Extension published')
}

publish()
