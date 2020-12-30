import React from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { withNavigation } from '@react-navigation/compat'
import { trim, isEmpty, get, flow } from 'lodash/fp'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { htmlEncode } from 'js-htmlencode'
import { rhino30 } from 'style/colors'
import styles from './InlineEditor.styles'
// Mentions
import { MENTION_ENTITY_TYPE } from 'hylo-utils/constants'
import scopedFetchPeopleAutocomplete from 'store/actions/scopedFetchPeopleAutocomplete'
import scopedGetPeopleAutocomplete from 'store/selectors/scopedGetPeopleAutocomplete'
import PersonPickerItemRow from 'screens/ItemChooser/PersonPickerItemRow'
// Topics
import fetchTopicsForCommunityId from 'store/actions/fetchTopicsForCommunityId'
import getTopicsForAutocompleteWithNew from 'store/selectors/getTopicsForAutocompleteWithNew'
import TopicRow from 'screens/TopicList/TopicRow'

export class InlineEditor extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isFocused: false,
      pickerType: null
    }
    this.editorInputRef = React.createRef()
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
      this.editorInputRef.current.focus()
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

  handleFocus = () => {
    this.setState(() => ({
      isFocused: true,
      selection: { start: 1, end: 1 }
    }))
    this.props.onFocusToggle && this.props.onFocusToggle(true)
  }

  handleBlur = () => {
    if (isEmpty(trim(this.props.value))) this.props.onChange('')
    this.setState(() => ({ isFocused: false }))
    this.props.onFocusToggle && this.props.onFocusToggle(false)
  }

  handleSelectionChange = ({ nativeEvent: { selection } }) => {
    this.setState(() => ({ selection }))
  }

  handleSubmit = () => {
    this.setState(() => ({ selection: { start: 0, end: 0 } }))
    this.editorInputRef.current.blur()
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
    const { isFocused } = this.state
    const hitSlop = { top: 7, bottom: 7, left: 7, right: 7 }
    return (
      <View style={[styles.container, style]} onFocus={this.handleFocus} onBlur={this.handleBlur}>
        <View style={styles.textInputAndTools}>
          <TextInput
            multiline
            editable={!!editable && !submitting}
            onChangeText={onChange}
            onSelectionChange={this.handleSelectionChange}
            placeholder={placeholder}
            placeholderTextColor={rhino30}
            style={[styles.textInput, inputStyle]}
            underlineColorAndroid='transparent'
            value={value}
            ref={this.editorInputRef}
          />
          <View style={styles.toolbar}>
            <TouchableOpacity hitSlop={hitSlop} onPress={this.openPersonPicker}>
              <Text style={styles.toolbarButton}>@</Text>
            </TouchableOpacity>
            <TouchableOpacity hitSlop={hitSlop} onPress={this.openTopicsPicker}>
              <Text style={styles.toolbarButton}>#</Text>
            </TouchableOpacity>
          </View>
        </View>
        <SubmitButton style={{...styles.submitButton, display: (onSubmit && value.length > 0) ? 'flex' : 'none'}} submitting={submitting} active={value.length > 0} onSubmit={this.handleSubmit} />
      </View>
    )
  }
}

export default withNavigation(InlineEditor)

export function SubmitButton ({ style, submitting, active, onSubmit }) {
  if (submitting) {
    return <View style={style}><ActivityIndicator /></View>
  } else {
    return (
      <TouchableOpacity hitSlop={{ top: 5, bottom: 10, left: 10, right: 10 }} disabled={!active} onPress={onSubmit}>
        <MaterialIcon name='send' size={26} style={[style, active && styles.activeButton]} />
      </TouchableOpacity>
    )
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
  const replace = '<br>'
  return text.replace(re, replace)
}

export const toHtml = flow([trim, htmlEncode, mentionsToHtml, newLinesToBr])
