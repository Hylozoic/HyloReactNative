import React from 'react'
import { last } from 'lodash/fp'
import PopupMenuButton from 'components/PopupMenuButton'
import { Text, View } from 'react-native'
import Icon from 'components/Icon'
import DocumentPicker from 'react-native-document-picker'
import styles from './FileSelector.styles'

export function cleanName (url) {
  return decodeURIComponent(last(url.split('/')))
}

export default function FileSelector (props) {
  const { files = [], onRemove } = props

  return (
    <View>
      {files.map((file, index) => renderFileButton(file, index, onRemove))}
    </View>
  )
}

export async function showFilePicker ({
  allowMultiSelection = true,
  id,
  onAdd,
  onCancel,
  onComplete,
  onError,
  type,
  upload
}) {
  try {
    const documents = await DocumentPicker.pickMultiple({
      type: [DocumentPicker.types.allFiles],
      allowMultiSelection
    })
    let fileUploaders = []

    documents.forEach(document => {
      fileUploaders = [
        ...fileUploaders,
        (async () => {
          const file = {
            uri: document.uri,
            name: document.name,
            type: document.type
          }

          onAdd && onAdd({ local: document.uri, remote: null })

          const { payload, error } = await upload(type, id, file)

          if (error) {
            onError && onError(payload.message, { local: document.uri, remote: null })
          } else {
            onAdd && onAdd({ local: document.uri, remote: payload.url })
          }
        })()
      ]
    })

    const uploadedFiles = await Promise.all(fileUploaders)

    onComplete && onComplete(uploadedFiles)
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      onCancel && onCancel()
    } else {
      onComplete && onComplete(error.message)
    }
  }
}

function renderFileButton (file, buttonIndex, onRemove) {
  return (
    <PopupMenuButton
      key={file.local}
      actions={[['Remove File', () => onRemove(file)]]}
      destructiveButtonIndex={0}
    >
      <FileLabel url={file.local} />
    </PopupMenuButton>
  )
}

export function FileLabel ({ url, style }) {
  return (
    <View style={[styles.fileLabel, style]}>
      <Icon name='Document' style={styles.fileIcon} />
      <Text style={styles.fileLabelText} numberOfLines={2}>
        {cleanName(url)}
      </Text>
    </View>
  )
}
