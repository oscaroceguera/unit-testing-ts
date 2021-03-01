import {  LoginHandler } from '../../app/Handlers/LoginHandler'
import { HTTP_CODES, HTTP_METHODS, SessionToken } from '../../app/Models/ServerModels'
import {Utils} from '../../app/Utils/Utils'

describe('Login Handler test suite', () => {
  let loginHandler: LoginHandler;
  
  const requestMock = {
    method: ''
  }
  const respoonseMock = {
    writeHead: jest.fn(),
    statusCode: '',
    write: jest.fn()
  }
  const authorizerMock = {
    generateToken: jest.fn()
  }
  const getRequestBodyMock = jest.fn()

  beforeEach(() => {
    loginHandler = new LoginHandler(
      requestMock as any,
      respoonseMock as any,
      authorizerMock as any
    )
    Utils.getRequestBody = getRequestBodyMock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const someSessionToken: SessionToken = {
    tokenId: 'someTokenId',
    userName: 'soomeUserName',
    valid: true,
    expirationTime: new Date(),
    accessRights: [1,2,3]
  }

  test('options request', async () => {
    requestMock.method = HTTP_METHODS.OPTIONS
    await loginHandler.handleRequest()
    expect(respoonseMock.writeHead).toBeCalledWith(HTTP_CODES.OK)
  })
  
  test('no handle http method', async () => {
    // respoonseMock.writeHead.mockClear()
    requestMock.method = 'someRandomMethod'
    await loginHandler.handleRequest()
    expect(respoonseMock.writeHead).not.toHaveBeenCalled()
  })

  test('post request with valid login', async () => {
    requestMock.method = HTTP_METHODS.POST
    
    getRequestBodyMock.mockReturnValueOnce({
      username: 'someuser',
      password: 'password'
    })

    authorizerMock.generateToken.mockReturnValueOnce(someSessionToken)
    
    await loginHandler.handleRequest()

    expect(respoonseMock.statusCode).toBe(HTTP_CODES.CREATED)
    expect(respoonseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' })
    expect(respoonseMock.write).toBeCalledWith(JSON.stringify(someSessionToken))
  })

  test('post request with invalid login', async () => {
    requestMock.method = HTTP_METHODS.POST
    
    getRequestBodyMock.mockReturnValueOnce({
      username: 'someuser',
      password: 'password'
    })

    authorizerMock.generateToken.mockReturnValueOnce(null)
    
    await loginHandler.handleRequest()

    expect(respoonseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND)
    expect(respoonseMock.write).toBeCalledWith('wrong username or password')
  })

  test('post request with unexpected error', async () => {
    requestMock.method = HTTP_METHODS.POST
    
    getRequestBodyMock.mockRejectedValueOnce(new Error('algo anda mal'))

    await loginHandler.handleRequest()

    expect(respoonseMock.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR)
    expect(respoonseMock.write).toBeCalledWith('Internal error: algo anda mal')
  })
})