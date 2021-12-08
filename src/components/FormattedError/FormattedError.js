import React from 'react'
import { View, Text } from 'react-native'
import { uniq, merge } from 'lodash/fp'
import LinkButton from 'navigation/linking/LinkButton'
import Triangle from 'react-native-triangle'
import { amaranth, white } from 'style/colors'

export function testJSON (text) {
  if (typeof text !== 'string') {
    return false
  } try {
    JSON.parse(text)
    return true
  } catch (e) {
    return false
  }
}

export function errorMessages (type, action) {
  var err

  if (testJSON(type)) {
    err = JSON.parse(type)
    err = err.error
  } else {
    err = type
  }

  const errors = {
    'no user': `${action} was canceled or no user data was found.`,
    'no email': 'Please enter a valid email address',
    'no email provided': 'Please enter a valid email address',
    'invalid-email': 'Please enter a valid email address',
    'duplicate-email': 'Account already exists',
    'no password provided': 'Please enter your password',
    'email not found': 'Email address not found',
    'invalid code': 'Invalid code, please try again',
    'invalid-link': 'Link expired, please try again',
    default: err
  }

  return errors[err] || errors.default
}

export const defaultStyles = {
  errorWrapper: {
    marginBottom: 10,
    alignItems: 'center'
  },
  error: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: amaranth,
    borderRadius: 100
  },
  errorText: {
    color: white,
    fontSize: 14
  },  
  errorTriangle: {
    backgroundColor: amaranth
  }
}

export default function FormattedError ({
  error,
  action = 'Operation',
  styles: providedStyles = {},
  theme = {}
}) {
  if (!error) return null

  const styles = merge(defaultStyles, providedStyles, theme)

  const noPasswordMatch = error.match(/password account not found. available: \[(.*)\]/)

  if (noPasswordMatch) {
    var options = uniq(noPasswordMatch[1].split(',')
      .map(option => ({
        'google': 'Google',
        'google-token': 'Google',
        'facebook': 'Facebook',
        'facebook-token': 'Facebook',
        'linkedin': 'LinkedIn',
        'linkedin-token': 'LinkedIn'
      }[option])))

    return (
      <Error styles={styles}>
        <Text style={styles.errorText}>
          Your account has no password set. <LinkButton to='/reset-password'>Set your password here.</LinkButton>
        </Text>
        {options[0] && (
          <Text style={styles.errorText}>Or log in with {options.join(' or ')}.</Text>
        )}
      </Error>
    )
  }

  const errorMessageText = errorMessages(error, action)

  return (
    <Error styles={styles}>
      {errorMessageText && (
        <Text style={styles.errorText}>{errorMessageText}</Text>
      )}
    </Error>
  )
}

export function Error ({ children, styles }) {
  return (
    <View style={styles.errorWrapper}>
      {!styles.hideErrorTriangle && (
        <Triangle styles={styles?.errorTriangle}
          width={10} height={5}
          color={styles.errorTriangle?.backgroundColor}
          direction='up' />
      )}
      <View style={styles.error}>
        {children}
      </View>
    </View>
  )
}
