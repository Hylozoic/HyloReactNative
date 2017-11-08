import React from 'react'
import ImagePicker from '../../ImagePicker'
import PopupMenuButton from '../../PopupMenuButton'
import { Image, View } from 'react-native'
import styles from './ImageSelector.styles'

export default class ImageSelector extends React.Component {
  static defaultProps = {imageUrls: []}

  renderImageButton = (imageUrl, buttonIndex) => {
    return <PopupMenuButton
      key={imageUrl}
      style={styles.addImageButton}
      actions={['Remove image']}
      destructiveButtonIndex={0}
      onSelect={menuIndex => this.props.onRemove(imageUrl)}>
      <Image style={styles.addImageButtonImage} source={{uri: imageUrl}} />
    </PopupMenuButton>
  }

  renderPickerButton (props) {
    return <ImagePicker
      {...props}
      onError={err => console.log(err)}
      onChoice={this.props.onAdd}
      type='post' />
  }

  render () {
    return <View style={styles.container}>
      {this.props.imageUrls.map(this.renderImageButton)}
      {this.renderPickerButton({
        style: styles.addImageButton,
        iconStyle: styles.addImageButtonIcon
      })}
    </View>
  }
}
