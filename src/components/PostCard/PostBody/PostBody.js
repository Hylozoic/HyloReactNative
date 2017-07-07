import React from 'react'
import { Image, View, StyleSheet, Text } from 'react-native'
import HTMLView from 'react-native-htmlview'
import { decode } from 'ent'
import { present, sanitize, textLength, truncate } from 'hylo-utils/text'

import LinkPreview from '../LinkPreview'

const MAX_DETAILS_LENGTH = 144

export default function PostBody ({ title, details, linkPreview, slug }) {
  const decodedTitle = decode(title)
  let presentedDetails = present(sanitize(details), {slug})
  if (textLength(presentedDetails) > MAX_DETAILS_LENGTH) {
    presentedDetails = truncate(presentedDetails, MAX_DETAILS_LENGTH)
  }

  return <View style={styles.container}>
    <Text style={styles.title}>{decodedTitle}</Text>
    <HTMLView
      stylesheet={richTextStyles}
      textComponentProps={{ style: styles.details }}
      value={presentedDetails} />
    {linkPreview && <LinkPreview {...linkPreview} />}
  </View>
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 20
  },
  title: {
    color: '#363D3C',
    fontSize: 19,
    fontFamily: 'Circular-Medium'
  },
  details: {
    marginTop: 12,
    color: '#5D757A',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Circular-Book'
  }
})

const richTextStyles = StyleSheet.create({
  a: {
    color: '#0DC39F'
  }
})
