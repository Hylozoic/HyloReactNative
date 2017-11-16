import React from 'react'
import { Text, View, Button, Image } from 'react-native'
import RNRestart from 'react-native-restart'
const axelFretting = require('../../assets/Axel_Fretting.png')

export default class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = {hasError: false}
  }

  componentDidCatch (error, info) {
    this.setState({hasError: true})

    console.log(error, info)
    // Log the error to Rollbar
    // logErrorToMyService(error, info)
  }

  render () {
    const { customErrorUI } = this.props
    if (this.state.hasError) {
      return customErrorUI || <DefaultErrorMessage />
    }
    return this.props.children
  }
}

function DefaultErrorMessage () {
  return <View style={styles.container}>
    <Text style={styles.titleText}>Oops. Something Went Wrong</Text>
    <Image source={axelFretting} style={styles.merkabaImage} />
    <Button title='Restart Hylo' style={styles.button} onPress={() => RNRestart.Restart()} />
  </View>
}

const styles = {
  titleText: {
    fontSize: 25,
    paddingBottom: 25
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1
  },
  merkabaImage: {
    height: 97,
    width: 97,
    marginBottom: 25
  },
  button: {
    marginTop: 20
  }
}
