import React, { PropTypes } from 'react'
import { Image } from 'react-native'

export default function Avatar (props) {
  const { avatarUrl } = props
  return <Image
    style={generateStyles(props)}
    source={{uri: avatarUrl}} />
}
Avatar.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  forFooter: PropTypes.bool,
  withBorder: PropTypes.bool,
  withOverlap: PropTypes.bool,
  zIndex: PropTypes.number
}

export const generateStyles = ({forFooter, withBorder, withOverlap, zIndex}) =>
  Object.assign(
    {},
    styles.avatar,
    withBorder ? styles.withBorder : null,
    withOverlap ? styles.withOverlap : null,
    forFooter ? styles.forFooter : null,
    {zIndex}
  )

const styles = {
  avatar: {
    borderRadius: 17,
    width: 34,
    height: 34
  },
  forFooter: {
    borderRadius: 12,
    width: 24,
    height: 24
  },
  withBorder: {
    borderColor: 'white',
    borderWidth: 2
  },
  withOverlap: {
    marginLeft: -11
  }
}
