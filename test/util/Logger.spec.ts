import { Logger, setTecsafeLogLevel } from '../../src/util/Logger'

describe('Logger', () => {
  let errorSpy: jest.SpyInstance
  let warnSpy: jest.SpyInstance
  let infoSpy: jest.SpyInstance
  let debugSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {})

    // Reset singleton state if possible or reset log level to avoid cross-test contamination
    setTecsafeLogLevel('error') // default
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should create a singleton instance', () => {
    const instance1 = Logger.getInstance()
    const instance2 = Logger.getInstance()
    expect(instance1).toBe(instance2)
  })

  it('should default to "error" level and only log errors', () => {
    const logger = Logger.getInstance()
    logger.error('error msg')
    logger.warn('warn msg')
    logger.info('info msg')
    logger.debug('debug msg')

    expect(errorSpy).toHaveBeenCalledWith('[TECSAFE]', 'error msg')
    expect(warnSpy).not.toHaveBeenCalled()
    expect(infoSpy).not.toHaveBeenCalled()
    expect(debugSpy).not.toHaveBeenCalled()
  })

  it('should not log anything when level is "mute"', () => {
    const logger = Logger.getInstance()
    setTecsafeLogLevel('mute')
    logger.error('error msg')
    logger.warn('warn msg')
    logger.info('info msg')
    logger.debug('debug msg')

    expect(errorSpy).not.toHaveBeenCalled()
    expect(warnSpy).not.toHaveBeenCalled()
    expect(infoSpy).not.toHaveBeenCalled()
    expect(debugSpy).not.toHaveBeenCalled()
  })

  it('should log warn and error when level is "warn"', () => {
    const logger = Logger.getInstance()
    logger.setLogLevel('warn')
    logger.error('error msg')
    logger.warn('warn msg')
    logger.info('info msg')
    logger.debug('debug msg')

    expect(errorSpy).toHaveBeenCalledWith('[TECSAFE]', 'error msg')
    expect(warnSpy).toHaveBeenCalledWith('[TECSAFE]', 'warn msg')
    expect(infoSpy).not.toHaveBeenCalled()
    expect(debugSpy).not.toHaveBeenCalled()
  })

  it('should log info, warn, and error when level is "info"', () => {
    const logger = Logger.getInstance()
    setTecsafeLogLevel('info')
    logger.error('error msg')
    logger.warn('warn msg')
    logger.info('info msg')
    logger.debug('debug msg')

    expect(errorSpy).toHaveBeenCalledWith('[TECSAFE]', 'error msg')
    expect(warnSpy).toHaveBeenCalledWith('[TECSAFE]', 'warn msg')
    expect(infoSpy).toHaveBeenCalledWith('[TECSAFE]', 'info msg')
    expect(debugSpy).not.toHaveBeenCalled()
  })

  it('should log everything when level is "debug"', () => {
    const logger = Logger.getInstance()
    logger.setLogLevel('debug')
    logger.error('error msg')
    logger.warn('warn msg')
    logger.info('info msg')
    logger.debug('debug msg')

    expect(errorSpy).toHaveBeenCalledWith('[TECSAFE]', 'error msg')
    expect(warnSpy).toHaveBeenCalledWith('[TECSAFE]', 'warn msg')
    expect(infoSpy).toHaveBeenCalledWith('[TECSAFE]', 'info msg')
    expect(debugSpy).toHaveBeenCalledWith('[TECSAFE]', 'debug msg')
  })
})
