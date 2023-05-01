import mongoose from 'mongoose'
import Logger from 'bunyan'
import { config } from './config'

const log: Logger = config.createLogger('📦 db')

export default () => {
  const connect = () => {
    mongoose.connect(`${config.MONGODB_URL}`)
    .then(() => log.info('🌈 Connected to MongoDB'))
    .catch((err) => {
      log.error('Error connecting to MongoDB:', err)
      return process.exit(1)
    })
  }
  connect()

  mongoose.connection.on('disconnected', connect)
}