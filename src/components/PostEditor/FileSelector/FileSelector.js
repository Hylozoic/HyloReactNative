import React from 'react'
import PopupMenuButton from '../../PopupMenuButton'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from '../../Icon'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import styles from './FileSelector.styles'
import { cleanName } from '../../../store/models/Attachment'

export default class FileSelector extends React.PureComponent {
  static defaultProps = {fileUrls: []}
  state = {}

  pick = () => {
    this.setState({pending: true})
    const { upload, type, id, onError } = this.props
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()]
    }, (err, result) => {
      if (err) return onError(err.message)

      const file = {
        uri: result.uri,
        name: result.fileName,
        type: result.type
      }

      return upload(type, id, file)
      .then(({ payload, error }) => {
        this.setState({pending: false})
        if (error) {
          onError && onError(payload.message)
        } else {
          this.props.onAdd({local: result.uri, remote: payload.url})
        }
      })
    })
  }

  render () {
    const { fileUrls, onRemove } = this.props
    const { pending } = this.state
    return <View style={styles.container}>
      {fileUrls.map((url, index) => renderFileButton(url, index, onRemove))}
      <TouchableOpacity onPress={this.pick}
        style={[styles.fileLabel, styles.addButton]}>
        <Icon name={pending ? 'Clock' : 'Paperclip'} style={styles.addIcon} />
        <Text style={styles.fileLabelText}>
          {pending ? 'Adding...' : 'Add file'}
        </Text>
      </TouchableOpacity>
    </View>
  }
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
