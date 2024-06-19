import React, { useLayoutEffect } from 'react'
import {
  Image,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import { useSelector } from 'react-redux'
import { getAuthenticated } from 'store/selectors/getAuthState'
import styles from './InviteExpired.styles'
import { useTranslation } from 'react-i18next'

const axolotlImage = require('assets/Axel_Fretting.png')

export default function InviteExpired ({ navigation }) {
  const { t } = useTranslation()
  const isAuthenticated = useSelector(getAuthenticated)
  const goBack = () => navigation.goBack()
  const goToLogin = () => navigation.navigate('Login')

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('Invitation Expired') })
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{t('This Invitation has expired or already been used')}</Text>
        <Text style={{ height: 40 }} />
        <Text style={styles.bodyText}>{t('Contact your moderator for another one')}.</Text>
      </View>
      <Image style={styles.image} resizeMode='stretch' source={axolotlImage} />
      <View style={styles.paddedRow}>
        <TouchableOpacity onPress={isAuthenticated ? goBack : goToLogin} style={styles.goToLoginButton}>
          {isAuthenticated
            ? <Text style={styles.goToLoginButtonText}>{t('Go Back')}</Text>
            : <Text style={styles.goToLoginButtonText}>{t('Log In')}</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}
