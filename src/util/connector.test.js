import { mapWhenFocused, mergeWhenFocused } from './connector'

describe('connector utils', () => {
  let props, func

  beforeEach(() => {
    props = { isFocused: false }
    func = jest.fn()
  })

  describe('mapWhenFocused', () => {
    it('does not call the wrapped function when unfocused', () => {
      mapWhenFocused(func)(null, props)
      expect(func).not.toHaveBeenCalled()
    })

    it('returns props unaltered when unfocused', () => {
      expect(mapWhenFocused(func)(null, props)).toEqual(props)
    })

    it('calls the wrapped function with state and props when focused', () => {
      props.isFocused = true
      mapWhenFocused(func)(null, props)
      expect(func).toHaveBeenCalledWith(null, props)
    })
  })

  describe('mergeWhenFocused', () => {
    it('does not call the wrapped function when unfocused', () => {
      mergeWhenFocused(func)(null, null, props)
      expect(func).not.toHaveBeenCalled()
    })

    it('returns (own)props unaltered when unfocused', () => {
      expect(mergeWhenFocused(func)(null, null, props)).toEqual(props)
    })

    it('calls the wrapped function with correct arguments when focused', () => {
      props.isFocused = true
      mergeWhenFocused(func)('stateProps', 'dispatchProps', props)
      expect(func).toHaveBeenCalledWith('stateProps', 'dispatchProps', props)
    })
  })
})
