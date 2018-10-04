import { connect } from 'react-redux'

const avatarUrl = 'http://digitalspyuk.cdnds.net/17/25/980x490/landscape-1498216547-avatar-neytiri.jpg'

const members = [
  {
    id: 1,
    name: 'Robbie Carlton',
    avatarUrl
  },
  {
    id: 1,
    name: 'Jonas Blume',
    avatarUrl
  },
  {
    id: 1,
    name: 'Michael Jackson',
    avatarUrl
  },
  {
    id: 1,
    name: 'Ken Wilber',
    avatarUrl
  }
]

export function mapStateToProps (state, props) {
  return {
    members
  }
}

export default connect(mapStateToProps)
