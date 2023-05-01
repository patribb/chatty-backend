import dotenv from 'dotenv'
import bunyan from 'bunyan'

dotenv.config({})

class Config {
  public MONGODB_URL: string | undefined
  public JWT_TOKEN: string | undefined
  public NODE_ENV: string | undefined
  public SECRET_KEY_ONE: string | undefined
  public SECRET_KEY_TWO: string | undefined
  public CLIENT_URL: string | undefined
  public REDIS_HOST: string | undefined

  private readonly DEFAULT_MONGODB_URL =
    ' mongodb+srv://Admin:admin123456@cluster0.fltdtkb.mongodb.net/chattydb?retryWrites=true&w=majority'

  constructor() {
    this.MONGODB_URL = process.env.MONGODB_URL || this.DEFAULT_MONGODB_URL
    this.JWT_TOKEN = process.env.JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6I'
    this.NODE_ENV = process.env.NODE_ENV || ''
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || ''
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || ''
    this.CLIENT_URL = process.env.CLIENT_URL || ''
    this.REDIS_HOST = process.env.REDIS_HOST || ''
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' })
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (typeof value === 'undefined') {
        throw new Error(`Configuration ${key} is undefined`)
      }
    }
  }
}

export const config: Config = new Config()
