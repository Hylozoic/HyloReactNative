import React from 'react'
import Feed from '../../Feed'
import Header from '../Header'

const title = 'Home'

export default class Home extends React.Component {
  static navigationOptions = ({navigation}) => (Header(navigation, title))

  render () {
    const { navigation, communityId } = this.props
    return <Feed navigation={navigation} communityId={communityId} />
  }
}
