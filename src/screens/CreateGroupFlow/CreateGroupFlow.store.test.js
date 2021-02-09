import reducer,
{
  createGroup,
  fetchGroupExists,
  saveGroupUrl,
  saveGroupName,
  clearNameAndUrlFromStore,
  SAVE_GROUP_NAME,
  SAVE_GROUP_URL,
  CLEAR_NAME_AND_URL_FROM_STORE,
  FETCH_URL_EXISTS
}
  from './CreateGroupFlow.store'

const name = 'group name'
const url = 'group_name'

describe('reducer', () => {
  describe('on SAVE_GROUP_NAME', () => {
    const action = {
      type: SAVE_GROUP_NAME,
      payload: name
    }
    it('sets display', () => {
      const state = {
        groupName: null
      }
      const newState = reducer(state, action)
      expect(newState.groupName).toEqual(name)
    })
  })
  describe('on SAVE_GROUP_URL', () => {
    const action = {
      type: SAVE_GROUP_URL,
      payload: url
    }
    it('sets display', () => {
      const state = {
        groupUrl: null
      }
      const newState = reducer(state, action)
      expect(newState.groupUrl).toEqual(url)
    })
  })
  describe('on CLEAR_NAME_AND_URL_FROM_STORE', () => {
    const action = {
      type: CLEAR_NAME_AND_URL_FROM_STORE
    }
    it('sets display', () => {
      const state = {
        groupName: name,
        groupUrl: url
      }
      const newState = reducer(state, action)
      expect(newState.groupName).toEqual(null)
      expect(newState.groupUrl).toEqual(null)
    })
  })
  describe('on FETCH_URL_EXISTS', () => {
    const exists = true
    const action = {
      type: FETCH_URL_EXISTS,
      payload: {
        data: {
          groupExists: {
            exists
          }
        }
      }
    }
    it('sets display', () => {
      const state = {
        urlExists: null
      }
      const newState = reducer(state, action)
      expect(newState.urlExists).toEqual(exists)
    })
  })
})

describe('showLoadingModal', () => {
  it('matches snapshot', () => expect(createGroup(name, url)).toMatchSnapshot())
})

describe('fetchGroupExists', () => {
  it('matches snapshot', () => expect(fetchGroupExists(url)).toMatchSnapshot())
})

describe('saveGroupName', () => {
  it('matches snapshot', () => expect(saveGroupName(name)).toMatchSnapshot())
})

describe('saveGroupUrl', () => {
  it('matches snapshot', () => expect(saveGroupUrl(url)).toMatchSnapshot())
})

describe('clearNameAndUrlFromStore', () => {
  it('matches snapshot', () => expect(clearNameAndUrlFromStore()).toMatchSnapshot())
})
