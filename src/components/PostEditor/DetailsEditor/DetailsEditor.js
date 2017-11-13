import React from 'react'
import { Button, View, TouchableOpacity, Image } from 'react-native'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import Editor from '../../Editor'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import { caribbeanGreen } from 'style/colors'
const BackImage = require('../../../assets/Back.png')

export default class DetailsEditor extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Details',
      headerTitleStyle: { color: 'black' },
      headerTintColor: caribbeanGreen,
      headerLeft: <TouchableOpacity onPress={() => navigation.goBack()}><Image style={styles.backIcon} source={BackImage} /></TouchableOpacity>,
      headerRight: <View style={styles.saveButton}>
        <Button color={caribbeanGreen} title={'Save'} onPress={() => navigation.goBack()} />
      </View>
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      content: props.initialContent
    }
  }

  componentWillUnmount () {
    this.props.saveChanges(this.state.content)
  }

  render () {
    const { initialContent, navigation } = this.props
    return <KeyboardFriendlyView style={styles.container} {...kavProps}>
      <Editor ref={ref => { this.editor = ref }}
        initialContent={initialContent}
        navigation={navigation}
        onChange={content => this.setState({content})}
        communityId={navigation.state.params.communityId} />
    </KeyboardFriendlyView>
  }
}

const styles = {
  saveButton: {
    marginRight: 10
  },
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  backIcon: {
    height: 25,
    width: 15,
    marginLeft: 10
  }
}
