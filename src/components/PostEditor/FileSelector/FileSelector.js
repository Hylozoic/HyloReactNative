import React from 'react'
import PopupMenuButton from '../../PopupMenuButton'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from '../../Icon'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import styles from './FileSelector.styles'
import { cleanName } from '../../../store/models/Attachment'

export default function FileSelector ({ upload, fileUrls, type, id, onAdd, onRemove }) {
  const onPress = pick({
    onChoice: onAdd,
    upload,
    type,
    id
  })

  return <View style={styles.container}>
    {fileUrls.map((url, index) => renderFileButton(url, index, onRemove))}
    <TouchableOpacity onPress={onPress}
      style={[styles.fileLabel, styles.addButton]}>
      <Icon name='Paperclip' style={styles.addIcon} />
      <Text style={styles.fileLabelText}>Add file</Text>
    </TouchableOpacity>
  </View>
}
FileSelector.defaultProps = {fileUrls: []}

const pick = ({ upload, type, id, onError, onChoice }) => () => {
  DocumentPicker.show({
    filetype: [DocumentPickerUtil.allFiles()]
  }, (err, result) => {
    if (err) return alert(err.message)

    const file = {
      uri: result.uri,
      name: result.fileName
    }

    return upload(type, id, file)
    .then(({ payload, error }) => {
      if (error) {
        onError && onError(payload.message)
      } else {
        onChoice({local: result.uri, remote: payload.url})
      }
    })
  })
}

function renderFileButton (url, buttonIndex, onRemove) {
  return <PopupMenuButton
    key={url}
    actions={['Remove image']}
    destructiveButtonIndex={0}
    onSelect={menuIndex => onRemove(url)}>
    <View style={styles.fileLabel}>
      <Icon name='Document' style={styles.fileIcon} />
      <Text style={styles.fileLabelText}
        numberOfLines={2}>
        {cleanName(url)}
      </Text>
    </View>
  </PopupMenuButton>
}
