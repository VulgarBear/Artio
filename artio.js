require('./src/util/Extensions')
require('dotenv').config()

const config = process.env.config
const HeimdallClient = require('./src/struct/HeimdallClient')
const Logger = require('./src/util/Logger')

const client = new HeimdallClient(config)

client.on('disconnect', () => Logger.warn('Connection lost...'))
  .on('reconnect', () => Logger.info('Attempting to reconnect...'))
  .on('error', err => Logger.error(err))
  .on('warn', info => Logger.warn(info))

client.start()

process.on('unhandledRejection', err => {
  Logger.error('An unhandled promise rejection occured')
  Logger.stacktrace(err)
})
