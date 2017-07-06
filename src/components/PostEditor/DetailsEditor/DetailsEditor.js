import React from 'react'
import { Button, KeyboardAvoidingView } from 'react-native'
import Editor from '../../Editor'
import { get } from 'lodash/fp'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'

export default class DetailsEditor extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { save } = get('state.params', navigation) || {}
    return {
      headerTitle: 'Details',
      headerRight: save ? <Button title='Save' onPress={save} /> : null
    }
  }

  componentDidMount () {
    const { navigation, saveChanges } = this.props
    navigation.setParams({
      save: () =>
        this.editor.getContentAsync()
        .then(content => saveChanges(content))
        .then(() => navigation.goBack())
    })
  }

  render () {
    return <KeyboardAvoidingView style={styles.container} {...kavProps}>
      <Editor ref={ref => { this.editor = ref }}
        initialContent={this.props.content} />
    </KeyboardAvoidingView>
  }
}

const styles = {
  container: {
    flex: 1
  }
}
