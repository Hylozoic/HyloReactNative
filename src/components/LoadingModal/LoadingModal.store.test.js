import reducer, { SET_LOADING_MODAL, setLoadingModal } from './LoadingModal.store'

describe('reducer', () => {
  describe('on SET_LOADING_MODAL', () => {
    const action = {
      type: SET_LOADING_MODAL,
      payload: true
    }
    it('sets display', () => {
      const state = {
        display: false
      }
      const newState = reducer(state, action)
      expect(newState.display).toEqual(true)
    })
  })
})

describe('setLoadingModal', () => {
  it('matches snapshot', () => expect(setLoadingModal(true)).toMatchSnapshot())
})
