import reducer, {
  setSearchTerm,
  setSearchFilter,
  getSearchTerm,
  getSearchFilter,
  fetchSearchResults,
  defaultState,
  MODULE_NAME
} from './SearchPage.store'

describe('reducer, setters and getters', () => {
  describe('on setSearchTerm', () => {
    it('sets the search term', () => {
      const search = 'lai'
      const action = setSearchTerm(search)
      const state = {
        [MODULE_NAME]: reducer(defaultState, action)
      }
      expect(getSearchTerm(state)).toEqual(search)
    })
  })
  describe('on setSearchFilter', () => {
    it('sets the search term', () => {
      const filter = 'post'
      const action = setSearchFilter(filter)
      const state = {
        [MODULE_NAME]: reducer(defaultState, action)
      }
      expect(getSearchFilter(state)).toEqual(filter)
    })
  })
})

describe('fetchSearchResults', () => {
  it('matches snapshot', () => {
    const params = {
      search: 'lae',
      offset: 20,
      filter: 'comment'
    }
    expect(fetchSearchResults(params)).toMatchSnapshot()
  })
})
