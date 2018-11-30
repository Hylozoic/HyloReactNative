import React from 'react'
import { Text, View, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import Search, { SearchType } from '../Search'
import styles from './InlineEditor.styles'
import { rhino30 } from 'style/colors'
import { trim, isEmpty, get, flow } from 'lodash/fp'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { htmlEncode } from 'js-htmlencode'
import { MENTION_ENTITY_TYPE } from 'hylo-utils/constants'

const INSERT_MENTION = 'Hylo/INSERT_MENTION'
const INSERT_TOPIC = 'Hylo/INSERT_TOPIC'

const minTextInputHeight = 40

export default class InlineEditor extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      showPicker: false,
      isFocused: false,
      pickerType: null,
      height: minTextInputHeight
    }
  }

  startPicker = action => {
    let pickerType = false
    switch (action) {
      case INSERT_MENTION:
        pickerType = SearchType.PERSON
        break
      case INSERT_TOPIC:
        pickerType = SearchType.TOPIC
        break
    }

    if (pickerType) {
      this.setState({ showPicker: true, pickerType })
    }
  }

  cancelPicker = () => {
    this.setState({showPicker: false})
  }

  insertPicked = choice => {
    const markup = getMarkup(this.state.pickerType, choice)
    const value = this.props.value || ''
    const position = get('selection.start', this.state) || 0

    // This will insert the markup at the current cursors position while padding the markup with spaces.
    const firstSlice = value.slice(0, position)
    const secondSlice = value.slice(position)
    const prePadding = firstSlice.length > 0 && !/\s$/.test(firstSlice) ? ' ' : ''
    let newValue = [firstSlice, prePadding, markup, ' '].join('')

    // gets the position directly after the inserted markup
    const newSelectionStart = newValue.length

    // Append the second part of the value (after the cursor)
    newValue += secondSlice

    this.props.onChange(newValue)

    if (this.state.pickerType === SearchType.TOPIC) {
      this.props.onInsertTopic([choice])
    }

    // We use a timeout since the onChange needs to propagate the new value change before setting the new selection
    setTimeout(() => {
      this.setState({showPicker: false, selection: {start: newSelectionStart, end: newSelectionStart}})
      this.editorInput.focus()
    }, 100)
  }

  handleInputFocus = () => {
    this.setState({ isFocused: true })
    this.props.onFocusToggle && this.props.onFocusToggle(true)
  }
  handleInputBlur = () => {
    if (isEmpty(trim(this.props.value))) this.props.onChange('')
    this.setState({ isFocused: false })
    this.props.onFocusToggle && this.props.onFocusToggle(false)
  }

  handleSubmit = () => {
    this.editorInput.blur()
    this.props.onSubmit(this.props.value)
  }

  handleSelectionChange = ({ nativeEvent: { selection } }) => this.setState({ selection })

  render () {
    const {
      placeholder = 'Details',
      editable = true,
      value,
      communityId,
      onChange,
      onSubmit,
      submitting = false,
      containerStyle,
      inputStyle
    } = this.props

    const { showPicker, isFocused, pickerType, height, selection } = this.state

    // Calculates a height based on textInput content size with the following constraint: 40 < height < maxHeight
    const calculatedHeight = Math.round(Math.min(Math.max((isEmpty(value) ? minTextInputHeight : height) + (isFocused ? 45 : 0), minTextInputHeight), 190))

    return <View style={[styles.container, containerStyle, {height: calculatedHeight}]}>
      <View style={styles.wrapper}>
        <TextInput
          editable={!!editable && !submitting}
          onChangeText={onChange}
          multiline
          blurOnSubmit={false}
          onContentSizeChange={(event) => this.setState({height: Math.round(event.nativeEvent.contentSize.height)})}
          selection={selection}
          onSelectionChange={this.handleSelectionChange}
          placeholder={placeholder}
          placeholderTextColor={rhino30}
          style={[styles.textInput, inputStyle]}
          underlineColorAndroid='transparent'
          value={value}
          ref={(input) => { this.editorInput = input }}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
        />
        {onSubmit && !isFocused && <SubmitButton submitting={submitting} active={!!isFocused} handleSubmit={this.handleSubmit} />}
      </View>
      {isFocused && <View style={styles.toolbar}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity hitSlop={{top: 7, bottom: 7, left: 7, right: 7}} onPress={() => this.startPicker(INSERT_MENTION)}>
            <Text style={styles.toolbarButton}>@</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={{top: 7, bottom: 7, left: 7, right: 7}} onPress={() => this.startPicker(INSERT_TOPIC)}>
            <Text style={styles.toolbarButton}>#</Text>
          </TouchableOpacity>
        </View>
        {onSubmit && <SubmitButton submitting={submitting} active={!!isFocused} handleSubmit={this.handleSubmit} />}
      </View>}
      {showPicker && <Modal
        animationType='slide'
        transparent={false}
        visible={showPicker}
        onRequestClose={() => {
          this.setState({showPicker: false})
        }}>
        <Search style={styles.search} type={pickerType}
          communityId={communityId}
          onSelect={this.insertPicked}
          onCancel={this.cancelPicker} />
      </Modal>}
    </View>
  }
}

export function SubmitButton ({submitting, active, handleSubmit}) {
  if (submitting) {
    return <View style={{width: 30}}><ActivityIndicator /></View>
  } else {
    return <TouchableOpacity style={{width: 30}} hitSlop={{top: 5, bottom: 10, left: 10, right: 10}} onPress={handleSubmit}>
      <MaterialIcon name='send' size={23} style={active && styles.activeButton} />
    </TouchableOpacity>
  }
}

export const createMentionTag = ({ id, name }) =>
  `[${name}:${id}]`

export const createTopicTag = topic =>
  `#${topic.name}`

export function getMarkup (action, choice) {
  let markup
  switch (action) {
    case SearchType.PERSON:
      markup = createMentionTag(choice)
      break
    case SearchType.TOPIC:
      markup = createTopicTag(choice)
      break
  }
  return markup
}

export const mentionsToHtml = (text) => {
  const re = /\[([^[]+):(\d+)\]/gi
  const replace = `<a href="#" data-entity-type="${MENTION_ENTITY_TYPE}" data-user-id="$2">$1</a>`
  return text.replace(re, replace)
}

export const newLinesToBr = (text) => {
  const re = /[\r\n|\r|\n]/gi
  const replace = `<br>`
  return text.replace(re, replace)
}

export const toHtml = flow([trim, htmlEncode, mentionsToHtml, newLinesToBr])
