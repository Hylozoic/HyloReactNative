import React, { useState, useEffect } from 'react'
import { ScrollView, View, Image, Text } from 'react-native'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import ImagePicker from 'components/ImagePicker'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import styles from './SignupFlow2.styles'

export default function SignupFlow2 ({
  currentUser, saveAndNext, avatarUrl,
  changeSetting, loadUserSettings,
  navigation
}) {
  const [localUri, setLocalUri] = useState(null)
  const [imagePickerPending, setImagePickerPending] = useState(false)


  // this is for the case where they logged in but hadn't finished sign up
  useEffect(() => {
    if (currentUser) loadUserSettings()
  }, [])

  const imageSource = localUri
    ? { uri: localUri }
    : avatarUrl && { uri: avatarUrl }  

  const imagePickerChildren = imageSource && !imagePickerPending
    ? <Image style={styles.image} source={imageSource} />
    : (
      <View style={styles.imagePickerBackground}>
        {imagePickerPending ? <Loading /> : <Icon name='AddImage' style={styles.cameraIcon} />}
      </View>
    )

  const onChoice = ({ local, remote }) => {
    changeSetting('avatarUrl')(remote)
    setLocalUri(local)
  }

  return (
    <KeyboardFriendlyView style={styles.container}>
      <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
        <View style={styles.header}>
          <Text style={styles.title}>Upload a Photo</Text>
        </View>
        <View style={styles.content}>
          <ImagePicker
            type='userAvatar'
            cameraType='front'
            id={currentUser.id}
            onChoice={choice => onChoice(choice)}
            onPendingChange={pending => setImagePickerPending(pending)}
            children={imagePickerChildren}
          /> 
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <Button
          style={styles.backButton}
          text='< Back'
          onPress={() => navigation.goBack()}
        />
        <Button
          style={styles.continueButton}
          text='Continue'
          onPress={saveAndNext}
        />
      </View>
    </KeyboardFriendlyView>
  )
}
