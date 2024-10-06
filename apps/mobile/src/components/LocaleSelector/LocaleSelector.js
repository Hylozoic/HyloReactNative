import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import useCurrentUser from 'urql-shared/hooks/useCurrentUser'
import updateUserSettings from 'store/actions/updateUserSettings'
import { white80onCaribbeanGreen } from 'style/colors'

const LocaleSelector = ({ small, dark }) => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const selectedLocale = i18n.language
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const currentUser = useCurrentUser()

  const handleSelectLocale = (locale) => {
    i18n.changeLanguage(locale)
    setDropdownVisible(false)
    if (!currentUser) return
    dispatch(updateUserSettings({ settings: { locale } }))
  }

  const styles = StyleSheet.create({
    container: {
      padding: 4,
      backgroundColor: dark ? null : white80onCaribbeanGreen,
      borderRadius: 4,
      alignItems: 'center'
    },
    selectorButton: {
      padding: 8,
      borderRadius: 5,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: dark ? null : '#ccc',
      backgroundColor: dark ? '#aaa' : '#fff',
      width: '100%'
    },
    selectorButtonText: {
      fontSize: 12,
      color: dark ? 'white' : '#333'
    },
    dropdown: {
      marginTop: 10,
      left: 16,
      top: 12,
      position: 'absolute',
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ccc'
    },
    optionButton: {
      padding: 12,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc'
    },
    selectedOption: {
      backgroundColor: '#007bff',
      borderColor: '#007bff'
    },
    optionText: {
      fontSize: 16,
      color: '#333'
    },
    selectedOptionText: {
      color: 'white'
    }
  })

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text style={styles.selectorButtonText}>
          {small ? '🌐' : `🌐 ${t('Language')}: ${selectedLocale === 'en' ? 'English' : 'Español'}`}
        </Text>
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedLocale === 'en' && styles.selectedOption
            ]}
            onPress={() => handleSelectLocale('en')}
          >
            <Text
              style={[
                styles.optionText,
                selectedLocale === 'en' && styles.selectedOptionText
              ]}
            >
              English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedLocale === 'es' && styles.selectedOption
            ]}
            onPress={() => handleSelectLocale('es')}
          >
            <Text
              style={[
                styles.optionText,
                selectedLocale === 'es' && styles.selectedOptionText
              ]}
            >
              Español
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default LocaleSelector
