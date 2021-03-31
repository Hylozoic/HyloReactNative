import reducer,
{
  createGroup,
  fetchGroupExists,
  saveGroupUrl,
  saveGroupName,
  clearCreateGroupStore,
  UPDATE_GROUP_NAME,
  SAVE_GROUP_URL,
  CLEAR_CREATE_GROUP_STORE,
  FETCH_URL_EXISTS,
  defaultState
}
  from './CreateGroupFlow.store'

const name = 'group name'
const slug = 'group_name'

describe('reducer', () => {
  describe('on UPDATE_GROUP_NAME', () => {
    const action = {
      type: UPDATE_GROUP_NAME,
      payload: name
    }
    it('sets display', () => {
      const state = {
        group: {
          name: null
        }
      }
      const newState = reducer(state, action)
      expect(newState.groupData.name).toEqual(name)
    })
  })
  describe('on CLEAR_CREATE_GROUP_STORE', () => {
    const action = {
      type: CLEAR_CREATE_GROUP_STORE
    }
    it('sets display', () => {
      const state = {
        groupData: {
          name,
          slug: url
        }
      }
      const newState = reducer(state, action)
      expect(newState).toEqual({defaultState)
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


describe('clearCreateGroupStore', () => {
  it('matches snapshot', () => expect(clearCreateGroupStore()).toMatchSnapshot())
})
