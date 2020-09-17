import React from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { trim, isEmpty, get, flow } from 'lodash/fp'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { htmlEncode } from 'js-htmlencode'
import { rhino30 } from 'style/colors'
import styles from './InlineEditor.styles'
// Mentions
import { MENTION_ENTITY_TYPE } from 'hylo-utils/constants'
import scopedFetchPeopleAutocomplete from '../../store/actions/scopedFetchPeopleAutocomplete'
import scopedGetPeopleAutocomplete from '../../store/selectors/scopedGetPeopleAutocomplete'
import PersonPickerItemRow from '../ItemChooser/PersonPickerItemRow'
// Topics
import fetchTopicsForCommunityId from '../../store/actions/fetchTopicsForCommunityId'
import getTopicsForAutocompleteWithNew from '../../store/selectors/getTopicsForAutocompleteWithNew'
import TopicRow from '../TopicList/TopicRow'

const minTextInputHeight = 18

export class InlineEditor extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isFocused: false,
      pickerType: null,
      height: minTextInputHeight
    }
  }

  insertTopic = topic => {
    const markup = createTopicTag(topic)
    return this.insertPicked(topic, markup, this.props.onInsertTopic)
  }

  insertMention = person => {
    const markup = createMentionTag(person)
    return this.insertPicked(person, markup)
  }

  insertPicked = (choice, markup, onInsertCallback = undefined) => {
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

    if (onInsertCallback) onInsertCallback([choice])

    // We use a timeout since the onChange needs to propagate
    // the new value change before setting the new selection
    setTimeout(() => {
      this.setState(() => ({
        selection: {
          start: newSelectionStart,
          end: newSelectionStart
        }
      }))
      this.editorInput.focus()
    }, 100)
  }

  openPersonPicker = () => {
    const { navigation } = this.props
    const screenTitle = 'Mention'
    navigation.navigate('ItemChooserScreen', {
      screenTitle,
      ItemRowComponent: PersonPickerItemRow,
      pickItem: this.insertMention,
      searchPlaceholder: 'Type here to search for people',
      fetchSearchSuggestions: scopedFetchPeopleAutocomplete,
      getSearchSuggestions: scopedGetPeopleAutocomplete(screenTitle)
    })
  }

  openTopicsPicker = () => {
    const { navigation } = this.props
    const screenTitle = 'Pick a Topic'
    navigation.navigate('ItemChooserScreen', {
      screenTitle,
      ItemRowComponent: TopicRow,
      pickItem: this.insertTopic,
      searchPlaceholder: 'Search for a topic by name',
      fetchSearchSuggestions: fetchTopicsForCommunityId(this.props.communityId),
      getSearchSuggestions: getTopicsForAutocompleteWithNew
    })
  }
 
  // Workaround to TextInput issues on Android: https://github.com/facebook/react-native/issues/17236
  _selection () {
    if (this.state.isFocused)
      return this.props.selection

    return { start: 0, end: 0 }
  }

  _onFocus = () => {
    this.setState(() => ({
      isFocused: true,
      selection: { start: 1, end: 1 }
    }))
    this.props.onFocusToggle && this.props.onFocusToggle(true)
  }

  _onBlur = () => {
    if (isEmpty(trim(this.props.value))) this.props.onChange('')
    this.setState(() => ({ isFocused: false }))
    this.props.onFocusToggle && this.props.onFocusToggle(false)
  }

  _onSelectionChange = ({ nativeEvent: { selection } }) => {
    this.setState(() => ({ selection }))
  }

  handleSubmit = () => {
    this.setState(() => ({ selection: { start: 0, end: 0 } }))
    this.editorInput.blur()
    this.props.onSubmit(this.props.value)
  }

  render () {
    const {
      placeholder = 'Details',
      editable = true,
      value,
      onChange,
      onSubmit,
      submitting = false,
      style,
      inputStyle
    } = this.props
    const { isFocused, height } = this.state
    const hitSlop = { top: 7, bottom: 7, left: 7, right: 7 }
    // Calculates a height based on textInput content size with the following constraint: 40 < height < maxHeight
    // const calculatedHeight = Math.round(Math.min(Math.max((isEmpty(value) ? minTextInputHeight : height) + (isFocused ? 45 : 0), minTextInputHeight), 190))

    return <View style={[styles.container, style]}>
      <View style={styles.wrapper}>
        <TextInput
          multiline
          editable={!!editable && !submitting}
          onChangeText={onChange}
          blurOnSubmit={false}
          onContentSizeChange={event => this.setState({ height: Math.round(event.nativeEvent.contentSize.height) })}
          selection={this._selection()}
          onSelectionChange={this._onSelectionChange}
          placeholder={placeholder}
          placeholderTextColor={rhino30}
          style={[styles.textInput, inputStyle]}
          underlineColorAndroid='transparent'
          value={value}
          ref={(input) => { this.editorInput = input }}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
        />
        {onSubmit && !isFocused && <SubmitButton submitting={submitting} active={!!isFocused} handleSubmit={this.handleSubmit} />}
      </View>
      {isFocused && <View style={styles.toolbar}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity hitSlop={hitSlop} onPress={this.openPersonPicker}>
            <Text style={styles.toolbarButton}>@</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={hitSlop} onPress={this.openTopicsPicker}>
            <Text style={styles.toolbarButton}>#</Text>
          </TouchableOpacity>
        </View>
        {onSubmit && <SubmitButton submitting={submitting} active={!!isFocused} handleSubmit={this.handleSubmit} />}
      </View>}
    </View>
  }
}

export default withNavigation(InlineEditor)

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
