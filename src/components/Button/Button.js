import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { caribbeanGreen, white } from 'style/colors'
import Icon from 'components/Icon'
import { omit } from 'lodash/fp'

export default function Button (props) {
  const {
    style: providedStyles = {},
    text,
    customIconRender,
    onPress,
    iconName,
    disabled
  } = props
  const {
    color = white,
    borderRadius = 100,
    borderColor = white,
    fontSize = 13,
    height = 30
  } = providedStyles

  const containerStyle = {
    ...styles.container,
    ...omit([
      'color',
      'backgroundColor',
      'disabledBackgroundColor',
      'fontSize',
      'height'
    ], providedStyles)
  }

  const backgroundColor = disabled
    ? providedStyles.disabledBackgroundColor
    : providedStyles.backgroundColor || caribbeanGreen
  const buttonStyle = { ...styles.button, backgroundColor, height, borderRadius, borderColor }
  const textStyle = { ...styles.text, color, fontSize }
  const iconStyle = { ...styles.icon, color, ...providedStyles.icon }

  return (
    <View style={containerStyle}>
      <TouchableOpacity disabled={disabled} onPress={disabled ? () => {} : onPress} style={styles.wrapper}>
        <View style={buttonStyle}>
          <View style={styles.buttonInner}>
            {customIconRender && customIconRender({ ...props, name: iconName, style: iconStyle })}
            {!customIconRender && iconName && <Icon name={iconName} style={iconStyle} />}
            <Text style={textStyle}>{text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = {
  container: {
    alignItems: 'center'
  },
  wrapper: {
    flexDirection: 'row'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1
  },
  buttonInner: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    fontFamily: 'Circular-Bold'
  },
  icon: {
    color: white,
    fontSize: 16,
    paddingRight: 5
  }
}
