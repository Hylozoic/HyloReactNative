import { connect } from 'react-redux'
import { setChoice, getChoice } from './MemberFeed.store'
import samplePost, { fakePerson } from '../../PostCard/samplePost'

const posts = [
  samplePost(), samplePost(), samplePost()
]

const comments = [
  {
    text: 'Nice one',
    creator: fakePerson()
  },
  {
    text: 'Nice one',
    creator: fakePerson()
  },
  {
    text: 'Nice one',
    creator: fakePerson()
  },
  {
    text: 'Nice one',
    creator: fakePerson()
  }
]

const upvotes = [
  samplePost(), samplePost()
]

export function mapStateToProps (state, props) {
  const choice = getChoice(state, props)
  var items = []
  var itemType

  switch (choice) {
    case 'Posts':
      items = posts
      itemType = 'post'
      break
    case 'Comments':
      items = comments
      itemType = 'comment'
      break
    case 'Upvotes':
      items = upvotes
      itemType = 'post'
      break
  }
  return {
    choice,
    items,
    itemType,
    fetchItems: () => {}
  }
}

export const mapDispatchToProps = {
  setChoice
}

export default connect(mapStateToProps, mapDispatchToProps)
