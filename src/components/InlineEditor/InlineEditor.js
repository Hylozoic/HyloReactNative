import React, { useEffect, useRef, useState } from 'react'
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
import { TextHelpers, MENTION_ENTITY_TYPE } from 'hylo-shared'
// Mentions
import scopedFetchPeopleAutocomplete from 'store/actions/scopedFetchPeopleAutocomplete'
import scopedGetPeopleAutocomplete from 'store/selectors/scopedGetPeopleAutocomplete'
import PersonPickerItemRow from 'screens/ItemChooser/PersonPickerItemRow'
// Topics
import fetchTopicsForGroupId from 'store/actions/fetchTopicsForGroupId'
import getTopicsForAutocompleteWithNew from 'store/selectors/getTopicsForAutocompleteWithNew'
import TopicRow from 'screens/TopicList/TopicRow'
// Styles
import { rhino30 } from 'style/colors'
import styles from './InlineEditor.styles'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { defaultTranslators } from 'node-html-markdown/dist/config'

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
  inputStyle,
  initialMentionPerson
}) {
  const navigation = useNavigation()
  const [selection, setSelection] = useState()
  const editorInputRef = useRef()

  useEffect(() => {
    if (initialMentionPerson && isEmpty(value)) {
      insertMention(initialMentionPerson)
    }
  }, [initialMentionPerson])

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
          <TouchableOpacity hitSlop={hitSlop} onPress={handleOpenPersonPicker} testID='mentionPicker'>
            <Text style={styles.toolbarButton}>@</Text>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={hitSlop} onPress={handleOpenTopicsPicker} testID='topicPicker'>
            <Text style={styles.toolbarButton}>#</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SubmitButton
        style={{
          ...styles.submitButton,
          display: (onSubmit && value.length > 0) ? 'flex' : 'none'
        }}
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
      <TouchableOpacity
        hitSlop={{ top: 5, bottom: 10, left: 10, right: 10 }}
        disabled={!active}
        onPress={onSubmit}
        testID='submitButton'
      >
        <MaterialIcon name='send' size={26} style={[style, active && styles.activeButton]} />
      </TouchableOpacity>
    )
  }
}

export const createMentionTag = ({ id, name }) =>
  `[${name}](${id})`

export const createTopicTag = topic =>
  `#${topic.name}`

export const mentionsToHTML = text => {
  const result = text.replace(
    /\[([^[]+)\]\((\d+)\)/gi,
    '<span data-type="mention" class="mention" data-id="$2" data-label="$1">$1</span>'
  )
  return result
}

export const TOPIC_REGEX = /\B(#([a-zA-Z-_]+\b)(?!;))/gi

export const topicsToHTML = text => {
  const result = text.replace(
    TOPIC_REGEX,
    '<span data-type="topic" class="topic" data-label="$2">$1</span>'
  )
  return result
}

// This allows multiple linebreaks with markdown by
// default will collapse.
// * This breaks markdown blocks/lists (ol, ul, etc)
// but we're not officially supporting those yet
export const newLinesToBr = text => text
  .replace(
    /[\r\n|\r|\n]/gi,
    '<br />'
  )

// NOTE: This is deprecated, shouldn't be used anywhere anymore
export const fromHTML = html => {
  if (!html) return ''

  return NodeHtmlMarkdown.translate(html, {}, {
    a: opts => {
      const { node, options, visitor } = opts
      if (node?.attrs['data-type'] === 'mention') {
        return {
          prefix: '[',
          postfix: `](${node?.attrs['data-id']})`
        }
      } else if (node?.attrs['data-type'] === 'topic') {
        return {
          prefix: '#',
          postfix: node?.attrs['data-label']
        }
      } else {
        defaultTranslators.a(opts)
      }
    }
  })
}

export const toHTML = text => {
  return flow([
    newLinesToBr,
    mentionsToHTML,
    topicsToHTML,
    TextHelpers.markdown
  ])(text)
}
