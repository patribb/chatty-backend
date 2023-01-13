import { Request, Response } from 'express';
import * as cloudinaryUploads from '@global/helpers/cloudinary-upload';
import { SignUp } from '@auth/controllers/signup';
import { CustomError } from '@global/helpers/error-handler';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { authService } from '@service/db/auth.service';
import { UserCache } from '@service/redis/user.cache';

jest.useFakeTimers()
jest.mock('@service/queues/base.queues')
jest.mock('@service/redis/user.cache')
jest.mock('@service/queues/user.queue')
jest.mock('@service/queues/auth.queue')
jest.mock('@global/helpers/cloudinary-upload')

describe('SigUp', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  })
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  })

  it('should throw an error if username is not available', () => {
    const req: Request = authMockRequest({}, {
      username: '',
      email: 'many@test.com',
      password: '123456',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
    }) as Request
    const res: Response = authMockResponse()
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Username is a required field')
    })
  })

  it('should throw an error if username length is less than minimun length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'ma',
        email:'many@test.com',
        password: '123456',
        avatarColor:'red',
        avatarImage:'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()
    SignUp.prototype.create(req, res).catch((error: CustomError) =>{
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Invalid username')
    })
  })

  it('should throw an error if username length is grater than maximum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'mathematics',
        email:'many@test.com',
        password: '123456',
        avatarColor:'red',
        avatarImage:'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()
    SignUp.prototype.create(req, res).catch((error: CustomError) =>{
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Invalid username')
    })
  })

  it('should throw an error if email is not valid', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Many',
        email:'not valid',
        password: '123456',
        avatarColor:'red',
        avatarImage:'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()
    SignUp.prototype.create(req, res).catch((error: CustomError) =>{
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Email must be valid')
    })
  })
  it('should throw an error if email is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Many',
        email:'',
        password: '123456',
        avatarColor:'red',
        avatarImage:'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()
    SignUp.prototype.create(req, res).catch((error: CustomError) =>{
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Email is a required field')
    })
  })

  it('should throw an error if password is not valid', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Many',
        email:'many@test.com',
        password: '',
        avatarColor:'red',
        avatarImage:'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()
    SignUp.prototype.create(req, res).catch((error: CustomError) =>{
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Password is a required field')
    })
  })

  it('should throw an error if password length is less than minimun length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Many',
        email:'many@test.com',
        password: '12',
        avatarColor:'red',
        avatarImage:'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()
    SignUp.prototype.create(req, res).catch((error: CustomError) =>{
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Invalid password')
    })
  })

  it('should throw an error if password length is greater than maximum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Many',
        email:'many@test.com',
        password: 'mathematics1',
        avatarColor:'red',
        avatarImage:'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()
    SignUp.prototype.create(req, res).catch((error: CustomError) =>{
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Invalid password')
    })
  })

  it('should throw unauthorize error is user already exist', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Many',
        email:'patricia@gmail.com',
        password: '123456',
        avatarColor:'red',
        avatarImage:'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()
    jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(authMock)
    SignUp.prototype.create(req, res).catch((error: CustomError) =>{
      expect(error.statusCode).toEqual(400)
      expect(error.serializeErrors().message).toEqual('Invalid credentials')
    })
  })

  it('should set session data for valid credentials and send correct json response', async () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Many',
        email:'many@test.com',
        password: '123456',
        avatarColor:'red',
        avatarImage:'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ=='
      }
    ) as Request
    const res: Response = authMockResponse()
    const userSpy = jest.spyOn(UserCache.prototype, 'saveUserToCache')
    jest.spyOn(cloudinaryUploads, 'uploads').mockImplementation((): any => Promise.resolve({version: '12457865', public_id: '74588521'}))
    jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(null as any)
    await SignUp.prototype.create(req, res)
    console.log(userSpy.mock);
    expect(req.session?.jwt).toBeDefined()
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: userSpy.mock.calls[0][2],
      token: req.session?.jwt
    })
  })
})
