import React from 'react'
import Feed from '../../Feed'
import Header from '../Header'
import Loading from '../../Loading'

const title = 'Home'

export default class Home extends React.Component {
  static navigationOptions = ({navigation}) => (Header(navigation, title))

  componentDidMount () {
    this.props.navigation.navigate('UserSettings')
  }

  render () {
    const { navigation, communityId, currentUser } = this.props
    if (!currentUser) return <Loading style={{flex: 1}} />
    return <Feed navigation={navigation} communityId={communityId} />
  }
}
