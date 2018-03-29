import React from 'react'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import Editor from '../../Editor'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import { TOPIC_ENTITY_TYPE } from 'hylo-utils/constants'
import cheerio from 'cheerio'
import { get } from 'lodash/fp'

import header from 'util/header'

export default class DetailsEditor extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const showPicker = !!get('state.params.showPicker', navigation)

    return header(navigation, {
      title: 'Details',
      right: { disabled: showPicker, text: 'Save', onPress: navigation.goBack }
    })
  }

  state = {
    content: this.props.initialContent || ''
  }

  componentWillUnmount () {
    this.save()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  save () {
    const { setTopics } = this.props
    const content = this.state.content
    if (setTopics) {
      const $ = cheerio.load(content)
      var topicNames = []
      $(`a[data-entity-type=${TOPIC_ENTITY_TYPE}]`).map((i, el) =>
        topicNames.push($(el).text().replace('#', '')))
      setTopics(topicNames)
    }
    this.props.saveChanges(content)
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
    backgroundColor: 'white',
    flex: 1
  }
}
