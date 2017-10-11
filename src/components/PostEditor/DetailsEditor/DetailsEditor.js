import React from 'react'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
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
  container: {
    flex: 1
  }
}
