import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import fetchGraphQL from '../util/fetchGraphQL'
import MyPosts from './MyPosts'

const placeholderUser = {
  name: 'Axolotl',
  avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
}

export default class HyloReactNative extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    fetchGraphQL('{ me { id name avatarUrl } }')
    .then(data => this.setState({currentUser: data.me}))
  }

  render () {
    const food = this.state.food || 'unknown'
    const { id, name, avatarUrl } = this.state.currentUser || placeholderUser
    return <View style={styles.container}>
      <Text style={styles.welcome}>
        Hello, {name}!
      </Text>
      <Image source={{uri: avatarUrl}} style={styles.axolotl} />
      <Text style={styles.welcome}>
        Your favorite food is {food}
      </Text>
      <TextInput
        style={styles.input}
        placeholder='Type your favorite food here'
        onChangeText={food => this.setState({food})} />
      <Text style={styles.fineprint}>
        Cmd+R: reload
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        Cmd+D/shake: dev menu
      </Text>
      {id && <MyPosts />}
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#22bf99',
    paddingTop: 20
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 5
  },
  fineprint: {
    color: '#fff',
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
