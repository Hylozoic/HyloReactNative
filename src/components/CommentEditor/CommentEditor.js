import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
// ⚠️⚠️⚠️ Deprecated - see https://github.com/facebook/react-native/pull/31402 for native `InputAccessoryView` component (React Native 0.68+) ⚠️⚠️⚠️
import { KeyboardAccessoryView } from '@flyerhq/react-native-keyboard-accessory-view'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { isEmpty } from 'lodash/fp'
import { isIOS } from 'util/platform'
import { TextHelpers } from 'hylo-shared'
import createComment from 'store/actions/createComment'
import HyloEditorWebView from 'screens/HyloEditorWebView'
import styles from './CommentEditor.styles'
import { useDispatch } from 'react-redux'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import Icon from 'components/Icon'
import { firstName } from 'store/models/Person'

export const KeyboardAccessoryCommentEditor = forwardRef(function KeyboardAccessoryCommentEditor ({
  renderScrollable,
  isModal,
  ...commentFormProps
}, ref) {
  const safeAreaInsets = useSafeAreaInsets()
  const actualTabBarHeight = useBottomTabBarHeight()
  const tabBarHeight = isModal ? 0 : actualTabBarHeight

  return (
    <KeyboardAccessoryView
      contentContainerStyle={{
        ...styles.keyboardAccessoryContainerStyle,
        paddingBottom: isModal ? safeAreaInsets.bottom : 0
      }}
      spaceBetweenKeyboardAndAccessoryView={isIOS ? -tabBarHeight : 0}
      contentOffsetKeyboardOpened={isIOS ? -tabBarHeight : 0}
      renderScrollable={renderScrollable}
    >
      <CommentEditor {...commentFormProps} ref={ref} />
    </KeyboardAccessoryView>
  )
})

export const CommentEditor = forwardRef(function CommentEditor ({
  groupId,
  postId,
  replyingTo,
  scrollToReplyingTo,
  clearReplyingTo
}, ref) {
  const dispatch = useDispatch()
  const [hasContent, setHasContent] = useState()
  const editorRef = useRef()
  const [contentHTML, setContentHTML] = useState()
  const [submitting, setSubmitting] = useState()

  const handleDone = useCallback(() => {
    clearReplyingTo()
    setContentHTML('<p> </p>')
    setHasContent(false)
    editorRef?.current.blur()
  }, [clearReplyingTo, setContentHTML])

  const handleCancel = useCallback(() => {
    if (replyingTo?.creator?.name) {
      clearReplyingTo()
    } else {
      handleDone()
    }
  }, [replyingTo?.creator?.name, handleDone, clearReplyingTo])

  const handleCreateComment = useCallback(async () => {
    const commentHTML = editorRef?.current.getHTML()

    if (!isEmpty(commentHTML)) {
      setSubmitting(true)

      const { error } = await dispatch(createComment({
        text: commentHTML,
        parentCommentId: replyingTo?.parentComment || replyingTo?.id || null,
        postId
      }))

      setSubmitting(false)

      if (error) {
        Alert.alert("Your comment couldn't be saved; please try again.")
      } else {
        handleDone()
      }
    }
  }, [handleDone, postId, replyingTo?.id, replyingTo?.parentComment, dispatch])

  useEffect(() => {
    if (replyingTo?.parentComment) {
      setHasContent(true)
      setContentHTML(`<p>${TextHelpers.mentionHTML(replyingTo.creator)}&nbsp;</p>`)
    } else {
      setHasContent(false)
      setContentHTML('<p></p>')
    }

    if (replyingTo?.id) {
      editorRef?.current.focus()
    }
  }, [replyingTo?.id])

  const handleChange = newHTML => {
    setHasContent(
      newHTML &&
      newHTML.trim() !== '<p></p>' &&
      newHTML.trim() !== '<p> </p>'
    )
  }

  useImperativeHandle(ref, () => ({
    clearContent: () => editorRef?.current.clearContent(),
    focus: () => editorRef?.current.focus(),
    blur: () => editorRef?.current.blur()
  }))

  return (
    <View>
      {replyingTo?.creator?.name && (
        <View style={styles.prompt}>
          <TouchableOpacity onPress={handleCancel}>
            <Icon name='Ex' style={styles.promptClearIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { scrollToReplyingTo() }}>
            <Text style={styles.promptText}>
              Replying to <Text style={{ fontWeight: 'bold' }}>{firstName(replyingTo?.creator)}'s</Text> comment
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.editor}>
        <HyloEditorWebView
          placeholder='Write a comment...'
          contentHTML={contentHTML}
          groupIds={[groupId]}
          readOnly={submitting}
          onChange={handleChange}
          containerStyle={styles.htmlEditor}
          ref={editorRef}
          widthOffset={45}
          customStyle={`
            .hyloAppEditorContainer {
              padding: 8px;
              overflow-y: auto;
              max-height: 200px;
            }
            .hyloAppEditorContainer .hyloAppEditor .ProseMirror {
            }
          `}
        />
        <CommentSubmitButton
          style={styles.submitButton}
          disabled={!hasContent}
          submitting={submitting}
          onPress={handleCreateComment}
        />
      </View>
    </View>
  )
})

export function CommentSubmitButton ({ style, submitting, disabled, onPress }) {
  if (submitting) {
    return <View style={style}><ActivityIndicator /></View>
  } else {
    return (
      <TouchableOpacity
        hitSlop={{ top: 5, bottom: 10, left: 10, right: 10 }}
        disabled={disabled}
        onPress={onPress}
        testID='submitButton'
      >
        <MaterialIcon name='send' size={26} style={[style, !disabled && styles.activeButton]} />
      </TouchableOpacity>
    )
  }
}

export default CommentEditor
