import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'

const sampleCommunity = {
  name: 'Hylo on Hylo',
  avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/community/1944/avatar/1489438401225_face.png',
  bannerUrl: 'https://d3ngex8q79bk55.cloudfront.net/community/1944/banner/1489687099172_ggbridge.jpg'
}

const newPost = () => console.log('open post editor')

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  return {
    currentUser,
    community: sampleCommunity
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    newPost
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
