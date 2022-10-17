import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { ScrollView, View, Image, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import getMe from 'store/selectors/getMe'
import updateUserSettings from 'store/actions/updateUserSettings'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import ImagePicker from 'components/ImagePicker'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import styles from './SignupUploadAvatar.styles'

export default function SignupUploadAvatar ({ navigation }) {
  const dispatch = useDispatch()
  const currentUser = useSelector(getMe)
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl)
  const [avatarImageSource, setAvatarImageSource] = useState({ uri: avatarUrl })
  const [imagePickerPending, setImagePickerPending] = useState(false)

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeftOnPress: () => {
        // onCancel: This will have the effect of fully Authorizing the user
        // and they will be forwarded to `AuthRoot`
        dispatch(updateUserSettings({ settings: { signupInProgress: false } }))
      }
    })
  })

  const onChoice = ({ local, remote }) => {
    setAvatarUrl(remote)
    setAvatarImageSource({ uri: local })
  }

  const saveAndNext = async () => {
    const response = await dispatch(updateUserSettings({ avatarUrl }))
    const responseError = response.payload.getData()?.error
    if (!responseError) navigation.navigate('SignupSetLocation')
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
          >
            {avatarImageSource && !imagePickerPending
              ? <Image style={styles.image} source={avatarImageSource} />
              : (
                <View style={styles.imagePickerBackground}>
                  {imagePickerPending ? <Loading /> : <Icon name='AddImage' style={styles.cameraIcon} />}
                </View>
              )
            }
          </ImagePicker>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        {/* <Button
          style={styles.backButton}
          text='< Back'
          onPress={() => navigation.goBack()}
        /> */}
        <Button
          style={styles.continueButton}
          text='Continue'
          onPress={saveAndNext}
        />
      </View>
    </KeyboardFriendlyView>
  )
}
