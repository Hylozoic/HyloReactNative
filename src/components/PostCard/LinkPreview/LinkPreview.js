import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { parse } from 'url'
import { openURL } from 'util'
import SpaceFillingImage from 'components/SpaceFillingImage'

export default function LinkPreview ({ title, url, imageUrl }) {
  const domain = parse(url).hostname.replace('www.', '')
  return (
    <TouchableOpacity
      style={styles.linkContainer}
      onPress={() => openURL(url)}
    >
      <SpaceFillingImage imageUrl={imageUrl} />
      <Text style={styles.linkTitle}>{title}</Text>
      <Text style={styles.linkDomain}>{domain.toUpperCase()}</Text>
    </TouchableOpacity>
  )
}

const styles = {
  linkContainer: {
    backgroundColor: '#FAFBFC',
    borderRadius: 2,
    borderColor: '#EAEBEB',
    borderWidth: 1,
    marginBottom: 6
  },
  linkTitle: {
    color: '#3F536E',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 6,
    marginLeft: 7,
    marginRight: 7
  },
  linkDomain: {
    color: '#3F536E',
    fontSize: 10,
    marginBottom: 9,
    marginLeft: 7,
    marginRight: 7
  }
}
