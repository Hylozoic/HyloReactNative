import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import HTMLView from 'react-native-htmlview'
import { decode } from 'ent'
import moment from 'moment'
import { present, sanitize } from 'hylo-utils/text'
import urlHandler from 'util/urlHandler'
import LinkPreview from '../LinkPreview'
import { caribbeanGreen } from 'style/colors'
import richTextStyles from 'style/richTextStyles'

const MAX_DETAILS_LENGTH = 144

export default class PostBody extends React.PureComponent {
  handleLinkPress = (url) => {
    const { slug, showMember, showTopic } = this.props
    urlHandler(url, showMember, showTopic, slug)
  }

  render () {
    const {
      title,
      details,
      endTime,
      linkPreview,
      slug,
      shouldTruncate
    } = this.props

    const decodedTitle = decode(title)
    const presentedDetails = present(
      sanitize(details).replace(/\n/g, '').replace('<p>&nbsp;</p>', ''),
      {slug, maxlength: shouldTruncate && MAX_DETAILS_LENGTH}
    )
    const presentedEndTime = endTime && moment(endTime).format('MMM D YYYY')

    return <View style={styles.container}>
      {presentedEndTime &&
        <Text style={styles.resourceEndsAt}>Resource ends {presentedEndTime}</Text>}
      <PostTitle title={decodedTitle} />
      <HTMLView
        onLinkPress={this.handleLinkPress}
        addLineBreaks
        stylesheet={richTextStyles}
        textComponentProps={{ style: styles.details }}
        value={presentedDetails} />
      {linkPreview && <LinkPreview {...linkPreview} />}
    </View>
  }
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
  resourceEndsAt: {
    color: caribbeanGreen,
    fontSize: 10,
    textTransform: 'uppercase'
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
