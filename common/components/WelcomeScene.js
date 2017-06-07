import React from 'react'
import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'
import MyPosts from './MyPosts'
import fetchCurrentUser from '../store/actions/fetchCurrentUser'
import { connect } from 'react-redux'

const placeholderUser = {
  name: 'Axolotl',
  avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
}


class WelcomeScene extends React.Component {
  static contextTypes = {navigate: React.PropTypes.func}

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.props.fetchCurrentUser()
  }

  render () {
    const { currentUser } = this.props
    const { name, avatarUrl } = currentUser || placeholderUser
    const { navigate } = this.context
    const showMyPosts = () =>
      navigate({title: 'Your Posts', component: MyPosts})

    return <View style={styles.container}>
      <Text style={styles.fineprint}>
        Cmd+R: reload
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        Cmd+D/shake: dev menu
      </Text>
      <Text style={styles.welcome}>
        Hello, {name}!
      </Text>
      <Image source={{uri: avatarUrl}} style={styles.axolotl} />
      <Button onPress={showMyPosts} title='Show my posts' />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 80
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 5
  },
  fineprint: {
    opacity: 0.7,
    fontSize: 12
  },
  axolotl: {
    width: 100,
    height: 100
  },
  input: {
    height: 40,
    width: Number(Dimensions.get('window').width),
    textAlign: 'center',
    fontStyle: 'italic'
  }
})

export default connect((state, props) => {
  return {
    currentUser: state.currentUser
  }
},
(dispatch, props) => {
  return {
    fetchCurrentUser: () => dispatch(fetchCurrentUser())
  }
})(WelcomeScene)
