import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import Editor from '../../Editor'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'

export default class DetailsEditor extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Details'
    }
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillUnmount () {
    this.props.saveChanges(this.state.content)
  }

  render () {
    const { content, navigation } = this.props
    return <KeyboardAvoidingView style={styles.container} {...kavProps}>
      <Editor ref={ref => { this.editor = ref }}
        initialContent={content}
        navigation={navigation}
        onChange={content => this.setState({content})}
        communityId={navigation.state.params.communityId} />
    </KeyboardAvoidingView>
  }
}

const styles = {
  container: {
    flex: 1
  }
}
