import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import HTMLView from 'react-native-htmlview'
import { decode } from 'ent'
import { present, sanitize } from 'hylo-utils/text'
import urlHandler from '../../../util/urlHandler'
import LinkPreview from '../LinkPreview'
import richTextStyles from '../../../style/richTextStyles'

const MAX_DETAILS_LENGTH = 144

export default function PostBody ({
  title,
  details,
  linkPreview,
  slug,
  showMember,
  showTopic,
  shouldTruncate,
  hideDetails
}) {
  const presentedDetails = present(
    sanitize(details).replace(/\n/g, '').replace('<p>&nbsp;</p>', ''),
    {slug, maxlength: shouldTruncate && MAX_DETAILS_LENGTH}
  )

  return <View style={styles.container}>
    <PostTitle title={title} />
    {!hideDetails && <HTMLView
      onLinkPress={url => urlHandler(url, showMember, showTopic, slug)}
      addLineBreaks={false}
      stylesheet={richTextStyles}
      textComponentProps={{ style: styles.details }}
      value={presentedDetails} />}
    {linkPreview && <LinkPreview {...linkPreview} />}
  </View>
}

export function PostTitle ({ title, style }) {
  const decodedTitle = decode(title)
  return <Text style={[styles.title, style]}>{decodedTitle}</Text>
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 20
  },
  title: {
    color: '#363D3C',
    fontSize: 19,
    fontFamily: 'Circular-Medium',
    marginBottom: 12
  },
  details: {
    marginTop: 12,
    color: '#5D757A',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Circular-Book'
  }
})
