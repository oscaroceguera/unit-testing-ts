import { Utils } from '../app/utils'

describe('Utils test suite', () => {
  // beforeEach(() => {
  //   console.log('before each')
  // })

  // beforeAll(() => {
  //   console.log('before all')
  // })
  test('first test', () => {
    const result = Utils.toUpperCase('abc')
    expect(result).toBe('ABC')
  })
  test('parse simple URL', () => {
    const result = Utils.parseUrl('http://localhost:8080/login')
    expect(result.href).toBe('http://localhost:8080/login')
    expect(result.port).toBe('8080')
    expect(result.protocol).toBe('http:')
    expect(result.query).toEqual({})
  })

  test('parse URL with query', () => {
    const parseUrl = Utils.parseUrl('http://localhost:8080/login?user=user&password=pass')
    const expectedQuery = {
      user: 'user',
      password: 'pass'
    }
    expect(parseUrl.query).toEqual(expectedQuery)
    expect(expectedQuery).toBe(expectedQuery)
  })

  test('test invald URL', () => {
    function expectError () {
      Utils.parseUrl('')
    }
    expect(expectError).toThrowError()
    expect(expectError).toThrow('Empty url!')
  })
 
  test('test invald URL with arrow function', () => {
    expect(() => {
      Utils.parseUrl('')
    }).toThrow('Empty url!')
  })
 
  test('test invald URL with try catch', () => {
    try {
      Utils.parseUrl('')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message')
    }
  })
})