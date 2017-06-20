import React from 'react'
import { View, Text } from 'react-native'
import { decode } from 'ent'
import LinkPreview from '../LinkPreview'

// const maxDetailsLength = 144

export default function PostBody ({ title, details, linkPreview }) {
  const decodedTitle = decode(title)

  // TODO: present details with linked mentions and tags

  return <View style={styles.container}>
    <Text style={styles.title}>{decodedTitle}</Text>
    <Text style={styles.details}>{details}</Text>
    {linkPreview && <LinkPreview {...linkPreview} />}
  </View>
}

const styles = {
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
}
