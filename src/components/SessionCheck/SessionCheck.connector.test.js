import { mergeProps } from './SessionCheck.connector'

jest.useFakeTimers()

describe('checkSession', () => {
  it('retries if there is an error', async () => {
    const numFailures = 3
    var failuresLeft = numFailures

    const dispatchProps = {
      fetchCurrentUser: jest.fn(),
      checkSession: jest.fn(() => {
        failuresLeft -= 1
        return Promise.resolve(failuresLeft > 0 ? {error: true} : {payload: true})
      })
    }

    const mergedProps = mergeProps({}, dispatchProps)
    const check = mergedProps.checkSession()
    while (failuresLeft > 0) { // eslint-disable-line
      await process.nextTick(() => {})
      jest.runAllTimers()
    }
    await check

    expect(dispatchProps.checkSession).toHaveBeenCalledTimes(numFailures)
    expect(dispatchProps.fetchCurrentUser).toBeCalled()
  })
})
