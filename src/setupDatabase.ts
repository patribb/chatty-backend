import mongoose from 'mongoose'
import Logger from 'bunyan'
import { config } from '@root/config'

mongoose.set('strictQuery', true)

const log: Logger = config.createLogger('database');

export default () => {
    const connect = () => {
        mongoose.connect(`${config.MONGODB_URL}`)
          .then(() => log.info('👽 Connected to MongoDB!'))
          .catch((err) => {
            log.error(err)
            return process.exit(1)
        })
    }
    connect()
    mongoose.connection.on('disconnected', connect)
}
