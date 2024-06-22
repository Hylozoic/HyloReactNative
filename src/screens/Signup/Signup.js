import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import validator from 'validator'
import { openURL } from 'hooks/useOpenURL'
import { useNavigation, useRoute, useNavigationState } from '@react-navigation/native'
import useRouteParam from 'hooks/useRouteParam'
import FormattedError from 'components/FormattedError'
import sendEmailVerification from 'store/actions/sendEmailVerification'
import { getAuthState, AuthState } from 'store/selectors/getAuthState'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Button from 'components/Button'
import providedStyles from './Signup.styles'
import SocialAuth from 'components/SocialAuth'

const backgroundImage = require('assets/signin_background.png')
const merkabaImage = require('assets/merkaba_white.png')

export default function Signup () {
  const { t } = useTranslation()
  const route = useRoute()
  const navigation = useNavigation()
  const currentRouteName = useNavigationState(state => state?.routes[state.index]?.name)
  const safeAreaInsets = useSafeAreaInsets()
  const dispatch = useDispatch()
  const authState = useSelector(getAuthState)
  const routeEmail = useRouteParam('email')
  const routeError = useRouteParam('error')
  const routeBannerError = useRouteParam('bannerError')
  const [email, providedSetEmail] = useState(routeEmail)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(routeError)
  // WIP: Positive message for `checkInvitation` result
  // const [message, setMessage] = useState(route.params?.message)
  const [bannerError, setBannerError] = useState(routeBannerError)
  const [canSubmit, setCanSubmit] = useState(!loading && email)
  const genericError = new Error(t('An account may already exist for this email address, Login or try resetting your password'))

  const signupRedirect = () => {
    switch (authState) {
      case AuthState.EmailValidation: {
        navigation.navigate('SignupEmailValidation', route.params)
        break
      }
      case AuthState.Registration: {
        navigation.navigate('SignupRegistration', route.params)
        break
      }
      case AuthState.SignupInProgress: {
        if (!['SignupUploadAvatar', 'SignupSetLocation'].includes(currentRouteName)) {
          navigation.navigate('SignupUploadAvatar', route.params)
        }
        break
      }
    }
  }

  useEffect(() => {
    if (!loading) signupRedirect()
  }, [loading, authState])

  const setEmail = validateEmail => {
    setBannerError()
    setError()
    setCanSubmit(!!validator.isEmail(validateEmail))
    providedSetEmail(validateEmail)
  }

  const handleSocialAuthStart = () => {
    setLoading(true)
  }

  const handleSocialAuthComplete = socialAuthError => {
    if (socialAuthError) setBannerError(socialAuthError)
    setLoading(false)
  }

  const submit = async () => {
    try {
      setLoading(true)

      const result = await dispatch(sendEmailVerification(email))

      if (result.payload.getData().success) {
        openURL(`/signup/verify-email?email=${encodeURIComponent(email)}`)
      } else {
        throw genericError
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    ...providedStyles,
    background: {
      ...providedStyles.background,
      height: providedStyles.background.height + safeAreaInsets.top
    },
    backgroundImage: {
      ...providedStyles.backgroundImage,
      height: providedStyles.backgroundImage.height + safeAreaInsets.top
    }
  }

  return (
    <KeyboardFriendlyView style={styles.container}>
      <ScrollView>
        {loading && <Text style={styles.bannerMessage}>{t('SIGNING UP')}</Text>}
        {bannerError && <Text style={styles.bannerError}>{bannerError}</Text>}

        <ImageBackground
          source={backgroundImage}
          style={styles.background}
          imageStyle={styles.backgroundImage}
        >
          <Image source={merkabaImage} style={styles.merkabaImage} />
          <Text style={styles.title}>{t('Welcome to Hylo')}</Text>
          <Text style={styles.subTitle}>{t('Stay connected, organized, and engaged with your group')}.</Text>
        </ImageBackground>
        <View style={styles.content}>
          <Text style={styles.labelText}>{t('Enter your email below to get started!')}</Text>
          <TextInput
            style={styles.textInput}
            returnKeyType='go'
            onSubmitEditing={canSubmit ? submit : () => {}}
            value={email}
            onChangeText={value => setEmail(value)}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            underlineColorAndroid='transparent'
          />
          <FormattedError styles={styles} error={error} action='Signup' />
          <Button
            style={styles.signupButton}
            text={loading ? t('Saving-ellipsis') : t('Continue')}
            onPress={submit}
            disabled={!canSubmit}
          />
          <SocialAuth onStart={handleSocialAuthStart} onComplete={handleSocialAuthComplete} forSignup />
          <View style={styles.login}>
            <Text style={styles.haveAccount}>{t('Already have an account?')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginButton}>{t('Log in now')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.terms}>
            <Text style={{ ...styles.haveAccount, ...styles.termsText }}>
              {t('Your data is safe with Hylo By clicking the Sign Up button above you are agreeing to these terms:')}
            </Text>
            <TouchableOpacity onPress={() => openURL('https://www.hylo.com/terms')}>
              <Text style={{ ...styles.loginButton, ...styles.termsText }}>{t('Terms of Service + Privacy Policy')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardFriendlyView>
  )
}
