import reducer, { SHOW_LOADING_MODAL, showLoadingModal } from './LoadingModal.store'

describe('reducer', () => {
  describe('on SHOW_LOADING_MODAL', () => {
    const action = {
      type: SHOW_LOADING_MODAL,
      payload: true
    }
    it('sets display', () => {
      const state = {
        shouldDisplay: false
      }
      const newState = reducer(state, action)
      expect(newState.shouldDisplay).toEqual(true)
    })
  })
})

describe('showLoadingModal', () => {
  it('matches snapshot', () => expect(showLoadingModal(true)).toMatchSnapshot())
})
