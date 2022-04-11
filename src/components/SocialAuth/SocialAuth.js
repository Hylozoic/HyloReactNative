import React from 'react'
import { useDispatch } from 'react-redux'
import { Text, View } from 'react-native'
import { loginWithApple, loginWithFacebook, loginWithGoogle } from './actions'
import checkLogin from 'store/actions/checkLogin'
import AppleLoginButton from './AppleLoginButton'
import FbLoginButton from './FbLoginButton'
import GoogleLoginButton from './GoogleLoginButton'
import { rhino60 } from 'style/colors'

export default function SocialAuth ({ onStart, onComplete, forSignup }) {
  const dispatch = useDispatch()

  const socialLoginMaker = loginWith => async token => {
    try {
      onStart()

      const response = await dispatch(loginWith(token))

      if (response.error) {
        const errorMessage = response?.payload?.response?.body

        if (errorMessage) {
          onComplete(errorMessage)
        }
      } else {
        await dispatch(checkLogin())
      }
    } catch (e) {
      onComplete(e.message)
    } finally {
      onComplete()
    }
  }

  return (
    <View style={styles.connectWith}>
      <Text style={styles.connectWithText}>Or connect with:</Text>
      <AppleLoginButton
        style={styles.socialLoginButton}
        onLoginFinished={socialLoginMaker(loginWithApple)}
        createErrorNotification={onComplete}
        signup={forSignup}
      />
      <GoogleLoginButton
        style={styles.socialLoginButton}
        onLoginFinished={socialLoginMaker(loginWithGoogle)}
        createErrorNotification={onComplete}
        signup={forSignup}
      />
      <FbLoginButton
        style={styles.socialLoginButton}
        onLoginFinished={socialLoginMaker(loginWithFacebook)}
        createErrorNotification={onComplete}
        signup={forSignup}
      />
    </View>
  )
}

const styles = {
  // Connect with:
  connectWith: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center'
  },
  connectWithText: {
    fontFamily: 'Circular-Book',
    fontSize: 14,
    color: rhino60,
    textAlign: 'center',
    marginBottom: 15
  },
  socialLoginButton: {
    minWidth: '65%',
    marginBottom: 10
  }
}
