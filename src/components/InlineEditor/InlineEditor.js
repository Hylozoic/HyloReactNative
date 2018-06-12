import React from 'react'
import { Text, View, TextInput, TouchableOpacity, Modal, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import Search, { SearchType } from '../Search'
import styles from './InlineEditor.styles'
import { rhino30 } from 'style/colors'
import { trim, size, isEmpty } from 'lodash/fp'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import { htmlEncode } from 'js-htmlencode'
import { MENTION_ENTITY_TYPE, TOPIC_ENTITY_TYPE } from 'hylo-utils/constants'

const INSERT_MENTION = 'Hylo/INSERT_MENTION'
const INSERT_TOPIC = 'Hylo/INSERT_TOPIC'

export default class InlineEditor extends React.PureComponent {
  state = {
    showPicker: false,
    isFocused: false,
    pickerType: null
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
    const value = trim(this.props.value)
    const newValue = value + (size(value) > 0 ? ' ' : '') + markup + ' '
    this.props.onChange(newValue)
    this.setState({showPicker: false})
    this.editorInput.focus()
  }

  handleInputFocus = () => this.setState({ isFocused: true })
  handleInputBlur = () => {
    if (isEmpty(trim(this.props.value))) this.props.onChange('')
    this.setState({ isFocused: false })
  }

  handleSubmit = () => {
    this.editorInput.blur()
    this.props.onSubmit(this.props.value)
  }

  render () {
    const {
      placeholder = 'Details',
      editable = true,
      value,
      communityId,
      onChange,
      submitting = false
    } = this.props

    const { showPicker, isFocused, pickerType } = this.state

    return <ScrollView keyboardShouldPersistTaps={'handled'} keyboardDismissMode='on-drag'
      contentContainerStyle={styles.container} >
      <KeyboardAvoidingView behavior={'padding'} enabled style={{flex: 1}}>
        <View style={styles.wrapper}>
          <TextInput
            editable={!!editable && !submitting}
            onChangeText={onChange}
            multiline
            blurOnSubmit={false}
            placeholder={placeholder}
            placeholderTextColor={rhino30}
            style={styles.textInput}
            underlineColorAndroid='transparent'
            value={value}
            ref={(input) => { this.editorInput = input }}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
          />
        </View>
        <View style={[styles.toolbar, isFocused && styles.activeToolbar]}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity hitSlop={{top: 7, bottom: 7, left: 7, right: 7}} onPress={() => this.startPicker(INSERT_MENTION)}>
              <Text style={styles.toolbarButton}>@</Text>
            </TouchableOpacity>
            <TouchableOpacity hitSlop={{top: 7, bottom: 7, left: 7, right: 7}} onPress={() => this.startPicker(INSERT_TOPIC)}>
              <Text style={styles.toolbarButton}>#</Text>
            </TouchableOpacity>
          </View>
          {this.props.onSubmit && submitting && <View style={{width: 30}}><ActivityIndicator /></View>}
          {this.props.onSubmit && !submitting && <TouchableOpacity style={{width: 30}} onPress={this.handleSubmit}>
            <EntypoIcon name='chevron-with-circle-right' style={[styles.sendButton, isFocused && styles.activeButton]} />
          </TouchableOpacity>}
        </View>
      </KeyboardAvoidingView>
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
    </ScrollView>
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

export function toHtml (text) {
  const encodedText = mentionsToHtml(htmlEncode(trim(text)))

  return encodedText
}
