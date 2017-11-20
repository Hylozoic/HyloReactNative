import React from 'react'
import PopupMenuButton from '../../PopupMenuButton'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import Icon from '../../Icon'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import styles from './FileSelector.styles'
import { cleanName } from '../../../store/models/Attachment'
import { partial } from 'lodash'

export default class FileSelector extends React.PureComponent {
  static defaultProps = {fileUrls: []}
  state = {}

  pick = () => {
    this.setState({pending: true})
    const { upload, type, id, onError } = this.props
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()]
    }, (err, result) => {
      if (err) {
        if (onError) {
          onError(err.message)
        } else {
          showAlert(err.message)
        }
        return
      }

      const file = {
        uri: result.uri,
        name: result.fileName,
        type: result.type
      }

      return upload(type, id, file)
      .then(({ payload: { url, message }, error }) => {
        this.setState({pending: false})
        if (error) {
          if (onError) {
            onError(message)
          } else {
            showAlert(message)
          }
        } else {
          this.props.onAdd({local: result.uri, remote: url})
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

const showAlert = partial(Alert.alert, 'Could not add file')

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
