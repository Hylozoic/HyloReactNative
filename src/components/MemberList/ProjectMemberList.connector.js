import { connect } from 'react-redux'
import {
  getSearch,
  setSearch
} from '../MemberList/MemberList.store'
import { getPresentedPost } from '../../store/selectors/getPost'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const { id } = props
  const search = getSearch(state, props)

  const project = getPresentedPost(state, {id})

  console.log('unfiltered members', get('members', project))

  const members = (get('members', project) || []).filter(m => m.name.toLowerCase().includes(search.toLowerCase()))

  console.log('filtered members', members)

  return {
    members
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    setSearch: search => dispatch(setSearch(search)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
