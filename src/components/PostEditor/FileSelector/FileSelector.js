import React from 'react'
import PopupMenuButton from '../../PopupMenuButton'
import { TouchableOpacity, Text, View } from 'react-native'
import Icon from '../../Icon'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import styles from './FileSelector.styles'
import { cleanName } from '../../../store/models/Attachment'

export default function FileSelector (props) {
  const {fileUrls = [], onRemove} = props
  return <View>
    {fileUrls.map((url, index) => renderFileButton(url, index, onRemove))}
  </View>
}

export function showFilePicker ({upload, type, id, onAdd, onError, onComplete}) {
  DocumentPicker.show({
    filetype: [DocumentPickerUtil.allFiles()]
  }, (err, result) => {
    if (err) {
      return onComplete && onComplete(err.message)
    }

    const file = {
      uri: result.uri,
      name: result.fileName,
      type: result.type
    }
    return upload(type, id, file)
      .then(({ payload: { url, message }, error }) => {
        onComplete && onComplete()
        if (error) {
          return onError && onError(message)
        } else {
          onAdd({local: result.uri, remote: url})
        }
      })
  })
}

export function FilePickerButton (props) {
  return <TouchableOpacity onPress={() => showFilePicker(props)}
    style={[styles.fileLabel, styles.addButton]}>
    <Icon name={props.pending ? 'Clock' : 'Paperclip'} style={styles.addIcon} />
    <Text style={styles.fileLabelText}>
      {props.pending ? 'Adding...' : 'Add file'}
    </Text>
  </TouchableOpacity>
}

function renderFileButton (url, buttonIndex, onRemove) {
  return <PopupMenuButton
    key={url}
    actions={[['Remove image', () => onRemove(url)]]}
    destructiveButtonIndex={0}>
    <FileLabel url={url} />
  </PopupMenuButton>
}

export function FileLabel ({ url }) {
  return <View style={styles.fileLabel}>
    <Icon name='Document' style={styles.fileIcon} />
    <Text style={styles.fileLabelText}
      numberOfLines={2}>
      {cleanName(url)}
    </Text>
  </View>
}
