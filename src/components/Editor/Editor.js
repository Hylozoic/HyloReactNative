import React from 'react'
import { Text, View } from 'react-native'
import { RichTextEditor, RichTextToolbar, actions } from 'react-native-zss-rich-text-editor'
import Icon from '../Icon'
import Search, { SearchType } from './Search'
import styles from './Editor.styles'

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
    switch (action) {
      case INSERT_MENTION:
        return this.setState({showPicker: SearchType.MENTION})
      case INSERT_TOPIC:
        return this.setState({showPicker: SearchType.TOPIC})
    }
  }

  cancelPicker = () => {
    this.setState({showPicker: false})
    this.editor.focusContent()
    this.editor.restoreSelection()
  }

  insertPicked = choice => {
    const type = this.state.showPicker
    this.setState({showPicker: false})
    let url, html
    switch (type) {
      case SearchType.MENTION:
        url = `/u/${choice.id}`
        html = `<a href="${url}">${choice.name}</a>`
        break
      case SearchType.TOPIC:
        url = `/t/${choice.id}`
        html = `<a href="${url}">#${choice.name}</a>`
    }
    this.editor.insertCustomHTML(html)
  }

  setupEditor (ref) {
    this.editor = ref
    if (ref && this.props.onChange) {
      this.editor.registerContentChangeListener(this.props.onChange)
    }
  }

  render () {
    const { showPicker } = this.state
    return <View style={[styles.container, this.props.style]}>
      <RichTextEditor initialContentHTML={this.props.initialContent}
        hiddenTitle
        enableOnChange
        ref={ref => this.setupEditor(ref)}
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
        onPressCustomAction={this.startPicker} />
      {!!showPicker &&
        <Search style={styles.search} type={showPicker}
          communityId={this.props.communityId}
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
