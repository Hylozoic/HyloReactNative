import React from 'react'
import { Text, View } from 'react-native'
import { RichTextEditor, RichTextToolbar, actions } from 'react-native-zss-rich-text-editor'
import Icon from '../Icon'
import Search, { SearchType } from './Search'
import styles from './Editor.styles'
import { MENTION_ENTITY_TYPE, TOPIC_ENTITY_TYPE } from 'hylo-utils/constants'
import { caribbeanGreen } from 'style/colors'

const INSERT_MENTION = 'Hylo/INSERT_MENTION'
const INSERT_TOPIC = 'Hylo/INSERT_TOPIC'

export default class Editor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  getContentAsync () {
    return this.editor.getContentHtml()
  }

  startPicker = action => {
    this.editor.prepareInsert()

    // This timeout avoids a race condition. the `prepareInsert` call above
    // calls `window.getSelection()` to store the current caret position so that
    // any inserted content ends up at the right place. But if we show the
    // picker too soon, `window.getSelection()` will be called after the editor
    // has lost focus, returning a selection of type None, which no longer has
    // the caret position. That will cause any inserted content to either not
    // appear at all or to appear in the wrong place.
    setTimeout(() => {
      switch (action) {
        case INSERT_MENTION:
          this.setState({showPicker: SearchType.MENTION})
          break
        case INSERT_TOPIC:
          this.setState({showPicker: SearchType.TOPIC})
          break
      }
    }, 200)
  }

  cancelPicker = () => {
    this.setState({showPicker: false})
    this.editor.focusContent()
    this.editor.restoreSelection()
  }

  insertPicked = choice => {
    let html
    switch (this.state.showPicker) {
      case SearchType.MENTION:
        html = createMentionTag(choice)
        break
      case SearchType.TOPIC:
        html = createTopicTag(choice)
        break
    }
    this.editor.insertCustomHTML(html)
    this.setState({showPicker: false})
  }

  setupEditor (ref) {
    this.editor = ref
    if (ref && this.props.onChange) {
      this.editor.registerContentChangeListener(this.props.onChange)
    }
  }

  render () {
    const {
      placeholder = 'Details',
      style,
      initialContent,
      communityId
    } = this.props

    const { showPicker } = this.state

    return <View style={[styles.container, style]}>
      <RichTextEditor initialContentHTML={initialContent}
        hiddenTitle
        enableOnChange
        ref={ref => this.setupEditor(ref)}
        contentPlaceholder={placeholder}
        customCSS={customCSS} />
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
        onPressCustomAction={this.startPicker} />
      {!!showPicker &&
        <Search style={styles.search} type={showPicker}
          communityId={communityId}
          onSelect={this.insertPicked}
          onCancel={this.cancelPicker} />}
    </View>
  }
}

function ToolbarIcon ({ action }) {
  const s = styles.icon
  let content
  switch (action) {
    case INSERT_MENTION:
      content = <Text style={s.mention}>@</Text>
      break
    case INSERT_TOPIC:
      content = <Icon name='Topics' style={s.topic} />
      break
  }

  return <View style={s.container}>
    {content}
  </View>
}

// the href atributes below are not used, but their presence changes the
// behavior of the editor when typing immediately after inserting a tag. without
// the href attributes, new typing ends up inside the tag.

export const createMentionTag = ({ id, name }) =>
  `<a href="#" data-entity-type="${MENTION_ENTITY_TYPE}" data-user-id="${id}">${name}</a>`

export const createTopicTag = topic =>
  `<a href="#" data-entity-type="${TOPIC_ENTITY_TYPE}">#${topic.name}</a>`

const customCSS = `
[data-entity-type="${MENTION_ENTITY_TYPE}"] {
  text-decoration: none;
  color: ${caribbeanGreen};
}

[data-entity-type="${TOPIC_ENTITY_TYPE}"] {
  text-decoration: none;
  color: ${caribbeanGreen};
}
`
