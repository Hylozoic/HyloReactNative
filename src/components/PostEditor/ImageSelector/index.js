import React from 'react'
import ImagePicker from '../../ImagePicker'
import PopupMenuButton from '../../PopupMenuButton'
import { Image } from 'react-native'
import styles from './ImageSelector.styles'
import { compact, isEmpty } from 'lodash'

export default class ImageSelector extends React.Component {
  renderPickerButton (props) {
    return <ImagePicker
      {...props}
      onError={err => console.log(err)}
      onCancel={() => console.log('canceled')}
      onChoice={this.props.onSelect}
      type='post' />
  }

  render () {
    const { onReset, imageUrls } = this.props

    if (!isEmpty(compact(imageUrls))) {
      return <PopupMenuButton
        style={styles.addImageButton}
        actions={['Change image', 'Remove image']}
        destructiveButtonIndex={1}
        onSelect={index => {
          if (index === 0) {
            return this.picker.getWrappedInstance().showPicker()
          }
          if (index === 1) return onReset()
        }}>
        <Image style={styles.addImageButtonImage} source={{uri: imageUrls[0]}} />
        {this.renderPickerButton({
          style: styles.hiddenImagePicker,
          ref: x => { this.picker = x }
        })}
      </PopupMenuButton>
    }

    return this.renderPickerButton({
      style: styles.addImageButton,
      iconStyle: styles.addImageButtonIcon
    })
  }
}
