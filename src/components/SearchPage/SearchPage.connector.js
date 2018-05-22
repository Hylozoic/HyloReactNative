import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import getMe from '../../store/selectors/getMe'
import {
  fetchSearchResults,
  FETCH_SEARCH,
  setSearchTerm,
  getSearchTerm,
  setSearchFilter,
  getSearchFilter
 } from './SearchPage.store'

import { every, includes } from 'lodash/fp'

export function mapStateToProps (state, props) {
  return {

  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    ...bindActionCreators({
      fetchSearchResults
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
