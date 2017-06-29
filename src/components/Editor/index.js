import React from 'react'
import { KeyboardAvoidingView, Text, View } from 'react-native'
import { RichTextEditor, RichTextToolbar, actions } from 'react-native-zss-rich-text-editor'
import Icon from '../Icon'

const INSERT_MENTION = 'Hylo/INSERT_MENTION'
const INSERT_TOPIC = 'Hylo/INSERT_TOPIC'

export default class Editor extends React.Component {
  getContentAsync () {
    return this.editor.getContentHtml()
  }

  insertMention () {
    console.log('insertMention')
  }

  insertTopic () {
    console.log('insertTopic')
  }

  render () {
    return <KeyboardAvoidingView style={styles.container} behavior='height'>
      <View style={styles.wrapper}>
        <RichTextEditor initialContentHTML={this.props.initialContent}
          hiddenTitle
          ref={ref => { this.editor = ref }}
          titlePlaceholder='title'
          contentPlaceholder='details' />
      </View>
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
    </KeyboardAvoidingView>
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
