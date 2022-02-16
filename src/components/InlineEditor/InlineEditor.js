import React, { useRef, useState } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { trim, isEmpty, flow } from 'lodash/fp'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { htmlToText } from 'html-to-text'
import { MENTION_ENTITY_TYPE } from 'hylo-shared'
import { rhino30 } from 'style/colors'
import styles from './InlineEditor.styles'
// Mentions
import scopedFetchPeopleAutocomplete from 'store/actions/scopedFetchPeopleAutocomplete'
import scopedGetPeopleAutocomplete from 'store/selectors/scopedGetPeopleAutocomplete'
import PersonPickerItemRow from 'screens/ItemChooser/PersonPickerItemRow'
// Topics
import fetchTopicsForGroupId from 'store/actions/fetchTopicsForGroupId'
import getTopicsForAutocompleteWithNew from 'store/selectors/getTopicsForAutocompleteWithNew'
import TopicRow from 'screens/TopicList/TopicRow'

export default function InlineEditor ({
  placeholder = 'Details',
  value = '',
  groupId,
  editable = true,
  submitting = false,
  onChange,
  onSubmit,
  onInsertTopic,
  onFocusToggle,
  style,
  inputStyle
}) {
  const navigation = useNavigation()
  const [selection, setSelection] = useState()
  const editorInputRef = useRef()

  const insertTopic = topic => {
    const markup = createTopicTag(topic)
    return insertPicked(topic, markup, onInsertTopic)
  }

  const insertMention = person => {
    const markup = createMentionTag(person)
    return insertPicked(person, markup)
  }

  const insertPicked = (choice, markup, onInsertCallback = undefined) => {
    const position = selection?.start || 0

    // This will insert the markup at the current cursors position while padding the markup with spaces.
    const firstSlice = value.slice(0, position)
    const secondSlice = value.slice(position)
    const prePadding = firstSlice.length > 0 && !/\s$/.test(firstSlice) ? ' ' : ''
    let newValue = [firstSlice, prePadding, markup, ' '].join('')

    // gets the position directly after the inserted markup
    const newSelectionStart = newValue.length

    // Append the second part of the value (after the cursor)
    newValue += secondSlice

    onChange(newValue)

    if (onInsertCallback) onInsertCallback([choice])

    setSelection({
      start: newSelectionStart,
      end: newSelectionStart
    })
    editorInputRef.current.focus()
  }

  const handleOpenPersonPicker = () => {
    const screenTitle = 'Mention'
    navigation.navigate('ItemChooser', {
      screenTitle,
      ItemRowComponent: PersonPickerItemRow,
      pickItem: insertMention,
      searchPlaceholder: 'Type here to search for people',
      fetchSearchSuggestions: scopedFetchPeopleAutocomplete,
      getSearchSuggestions: scopedGetPeopleAutocomplete(screenTitle)
    })
  }

  const handleOpenTopicsPicker = () => {
    const screenTitle = 'Pick a Topic'
    navigation.navigate('ItemChooser', {
      screenTitle,
      ItemRowComponent: TopicRow,
      pickItem: insertTopic,
      searchPlaceholder: 'Search for a topic by name',
      fetchSearchSuggestions: fetchTopicsForGroupId(groupId),
      getSearchSuggestions: getTopicsForAutocompleteWithNew
    })
  }

  const handleFocus = () => {
    setSelection({ start: 1, end: 1 })
    onFocusToggle && onFocusToggle(true)
  }

  const handleBlur = () => {
    if (isEmpty(trim(value))) onChange('')
    onFocusToggle && onFocusToggle(false)
  }

  const handleSelectionChange = ({ nativeEvent: { selection } }) => {
    setSelection(selection)
  }

  const handleSubmit = () => {
    setSelection({ start: 0, end: 0 })
    editorInputRef.current.blur()
    onSubmit(value)
  }

  const hitSlop = { top: 7, bottom: 7, left: 7, right: 7 }

  return (
    <View style={[styles.container, style]} onFocus={handleFocus} onBlur={handleBlur}>
      <View style={styles.textInputAndTools}>
        <TextInput
          multiline
          editable={!!editable && !submitting}
          onChangeText={onChange}
          onSelectionChange={handleSelectionChange}
          placeholder={placeholder}
          placeholderTextColor={rhino30}
          style={[styles.textInput, inputStyle]}
          underlineColorAndroid='transparent'
          value={value}
          ref={editorInputRef}
        />
        <View style={styles.toolbar}>
          <TouchableOpacity hitSlop={hitSlop} onPress={handleOpenPersonPicker}>
            <Text style={styles.toolbarButton}>@</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={hitSlop} onPress={handleOpenTopicsPicker}>
            <Text style={styles.toolbarButton}>#</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SubmitButton
        style={{ ...styles.submitButton, display: (onSubmit && value.length > 0) ? 'flex' : 'none' }}
        submitting={submitting}
        active={value.length > 0}
        onSubmit={handleSubmit}
      />
    </View>
  )
}

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

export const mentionsToHTML = (text) => {
  const re = /\[([^[]+):(\d+)\]/gi
  const replace = `<a href="#" data-entity-type="${MENTION_ENTITY_TYPE}" data-user-id="$2">$1</a>`
  return text.replace(re, replace)
}

export const newLinesToBr = (text) => text.replace(/[\r\n|\r|\n]/gi, '<br>')

export const fromHTML = html => htmlToText(html, {
  formatters: {
    mentionFormatter: (elem, walk, builder, formatOptions) => {
      builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 0 })
      builder.addInline('[')
      walk(elem.children, builder)
      builder.addInline(`:${elem.attribs['data-user-id']}]`)
      builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 0 })
    }
  },
  selectors: [
    {
      selector: `a[data-entity-type=${MENTION_ENTITY_TYPE}]`,
      format: 'mentionFormatter'
    }
  ]
})

export const toHTML = flow([trim, mentionsToHTML, newLinesToBr])
