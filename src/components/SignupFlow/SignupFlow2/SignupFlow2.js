import React from 'react'
import {
  View,
  Image,
  Text
} from 'react-native'
import ImagePicker from '../../ImagePicker'
import Button from '../../Button'
import Icon from '../../Icon'
import Loading from '../../Loading'
import styles from './SignupFlow2.styles'

export default class SignupFlow2 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      localUri: null,
      imagePickerPending: false
    }
  }

  static navigationOptions = () => ({
    headerTitle: 'STEP 2/5',
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerTintColor: styles.headerTintColor,
    backTitle: null
  })

  render () {
    const { changeSetting, saveAndNext, avatarUrl } = this.props
    const { localUri, imagePickerPending } = this.state

    const imageSource = localUri
      ? {uri: localUri}
      : avatarUrl && {uri: avatarUrl}

    const onChoice = ({ localUri, webUrl }) => {
      changeSetting('avatarUrl')(webUrl)
      this.setState({localUri})
    }

    const imagePickerChildren = imageSource
      ? <Image style={styles.image} source={imageSource} />
      : <View style={styles.imagePickerBackground}>
        {imagePickerPending ? <Loading /> : <Icon name='AddImage' style={styles.cameraIcon} />}
      </View>

    return <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <ImagePicker title='Upload a Photo'
          path='testpath/avatar/'
          onChoice={onChoice}
          onPendingChange={pending => this.setState({imagePickerPending: pending})}>
          {imagePickerChildren}
        </ImagePicker>
        <View><Text style={styles.title}>Upload a Photo</Text></View>
      </View>
      <Button
        style={styles.continueButton}
        text='Continue'
        onPress={saveAndNext} />
    </View>
  }
}
