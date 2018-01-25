import reducer,
  {
    createCommunity,
    fetchCommunityExists,
    saveCommunityUrl,
    saveCommunityName,
    clearNameAndUrlFromStore,
    SAVE_COMMUNITY_NAME,
    SAVE_COMMUNITY_URL,
    CLEAR_NAME_AND_URL_FROM_STORE,
    FETCH_URL_EXISTS
  }
  from './CreateCommunityFlow.store'

const name = 'community name'
const url = 'community_name'

describe('reducer', () => {
  describe('on SAVE_COMMUNITY_NAME', () => {
    const action = {
      type: SAVE_COMMUNITY_NAME,
      payload: name
    }
    it('sets display', () => {
      const state = {
        communityName: null
      }
      const newState = reducer(state, action)
      expect(newState.communityName).toEqual(name)
    })
  })
  describe('on SAVE_COMMUNITY_URL', () => {
    const action = {
      type: SAVE_COMMUNITY_URL,
      payload: url
    }
    it('sets display', () => {
      const state = {
        communityUrl: null
      }
      const newState = reducer(state, action)
      expect(newState.communityUrl).toEqual(url)
    })
  })
  describe('on CLEAR_NAME_AND_URL_FROM_STORE', () => {
    const action = {
      type: CLEAR_NAME_AND_URL_FROM_STORE
    }
    it('sets display', () => {
      const state = {
        communityName: name,
        communityUrl: url
      }
      const newState = reducer(state, action)
      expect(newState.communityName).toEqual(null)
      expect(newState.communityUrl).toEqual(null)
    })
  })
  describe('on FETCH_URL_EXISTS', () => {
    const exists = true
    const action = {
      type: FETCH_URL_EXISTS,
      payload: {
        data: {
          communityExists: {
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
  it('matches snapshot', () => expect(createCommunity(name, url)).toMatchSnapshot())
})

describe('fetchCommunityExists', () => {
  it('matches snapshot', () => expect(fetchCommunityExists(url)).toMatchSnapshot())
})

describe('saveCommunityName', () => {
  it('matches snapshot', () => expect(saveCommunityName(name)).toMatchSnapshot())
})

describe('saveCommunityUrl', () => {
  it('matches snapshot', () => expect(saveCommunityUrl(url)).toMatchSnapshot())
})

describe('clearNameAndUrlFromStore', () => {
  it('matches snapshot', () => expect(clearNameAndUrlFromStore()).toMatchSnapshot())
})
