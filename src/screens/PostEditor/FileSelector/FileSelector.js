import React from 'react'
import PopupMenuButton from 'components/PopupMenuButton'
import { Text, View } from 'react-native'
import Icon from 'components/Icon'
import DocumentPicker from 'react-native-document-picker'
import styles from './FileSelector.styles'
import { cleanName } from 'store/models/Attachment'

export default function FileSelector (props) {
  const { fileUrls = [], onRemove } = props

  return (
    <View>
      {fileUrls.map((url, index) => renderFileButton(url, index, onRemove))}
    </View>
  )
}

export async function showFilePicker ({
  allowMultiSelection = true, id, onAdd, onCancel,
  onComplete, onError, type, upload
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
          const { payload, error } = await upload(type, id, file)

          if (error) {
            onError && onError(payload.message)
          } else {
            onAdd && onAdd({ local: document.uri, remote: payload.url })
          }
        })()
      ]
    })

    const uploadedFiles = await Promise.all(fileUploaders)

    onComplete && onComplete(uploadedFiles)
  } catch (error) {
    // TODO: Always onComplete?
    if (DocumentPicker.isCancel(error)) {
      onCancel && onCancel()
    } else {
      onComplete && onComplete(error.message)
    }
  }
}

function renderFileButton (url, buttonIndex, onRemove) {
  return (
    <PopupMenuButton
      key={url}
      actions={[['Remove image', () => onRemove(url)]]}
      destructiveButtonIndex={0}
    >
      <FileLabel url={url} />
    </PopupMenuButton>
  )
}

export function FileLabel ({ url }) {
  return (
    <View style={styles.fileLabel}>
      <Icon name='Document' style={styles.fileIcon} />
      <Text
        style={styles.fileLabelText}
        numberOfLines={2}
      >
        {cleanName(url)}
      </Text>
    </View>
  )
}
