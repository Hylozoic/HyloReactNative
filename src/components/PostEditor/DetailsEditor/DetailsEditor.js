import React from 'react'
import { Button, View } from 'react-native'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import Editor from '../../Editor'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import { caribbeanGreen } from 'style/colors'
import styles from './DetailsEditor.styles'
import BackArrow from '../../BackArrow'

export default class DetailsEditor extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Details',
      headerTitleStyle: { color: 'black' },
      headerTintColor: caribbeanGreen,
      headerLeft: <BackArrow navigation={navigation} />,
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
