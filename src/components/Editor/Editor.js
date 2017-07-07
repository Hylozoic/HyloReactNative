import React from 'react'
import { Text, View } from 'react-native'
import { RichTextEditor, RichTextToolbar, actions } from 'react-native-zss-rich-text-editor'
import Icon from '../Icon'

const INSERT_MENTION = 'Hylo/INSERT_MENTION'
const INSERT_TOPIC = 'Hylo/INSERT_TOPIC'

export default class Editor extends React.Component {
  getContentAsync () {
    return this.editor.getContentHtml()
  }

  insertMention () {
    const { navigation } = this.props
    navigation.navigate('Search', {
      type: 'mention',
      title: 'Mention a person',
      onSelect: person => {
        alert(`You chose ${person.name}! Good choice!`)
      }
    })
  }

  insertTopic () {
    this.props.navigation.navigate('Search', {
      type: 'topic',
      title: 'Insert a topic tag',
      onSelect: topic => {
        alert(`You chose ${topic.name}! Good choice!`)
      }
    })
  }

  render () {
    return <View style={[styles.container, this.props.style]}>
      <RichTextEditor initialContentHTML={this.props.initialContent}
        hiddenTitle
        ref={ref => { this.editor = ref }}
        contentPlaceholder='details' />
      <RichTextToolbar getEditor={() => this.editor}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.insertLink,
          INSERT_MENTION,
          INSERT_TOPIC
        ]}
        renderIcon={(action, selected) => {
          switch (action) {
            case INSERT_MENTION:
            case INSERT_TOPIC:
              return <ToolbarIcon action={action} />
          }
        }}
        onPressCustomAction={action => {
          switch (action) {
            case INSERT_MENTION:
              return this.insertMention()
            case INSERT_TOPIC:
              return this.insertTopic()
          }
        }} />
    </View>
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  wrapper: {
    flex: 1
  }
}

function ToolbarIcon ({ action }) {
  let content
  switch (action) {
    case INSERT_MENTION:
      content = <Text style={iconStyles.mention}>@</Text>
      break
    case INSERT_TOPIC:
      content = <Icon name='Topics' style={iconStyles.topic} />
      break
  }

  return <View style={iconStyles.container}>
    {content}
  </View>
}

const iconStyles = {
  container: {
    alignItems: 'center'
  },
  mention: {
    color: '#808080',
    fontSize: 22,
    fontWeight: '200',
    paddingBottom: 2
  },
  topic: {
    color: '#999',
    fontSize: 22
  }
}
