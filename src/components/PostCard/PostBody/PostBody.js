import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import HTMLView from 'react-native-htmlview'
import { decode } from 'ent'
import moment from 'moment'
import { present, sanitize } from 'hylo-utils/text'
import urlHandler from 'routing/urlHandler'
import LinkPreview from 'components/PostCard/LinkPreview'
import { white20onCaribbeanGreen } from 'style/colors'
import richTextStyles from 'style/richTextStyles'

const MAX_DETAILS_LENGTH = 144

const formatStartDate = (startTime) => {
  const current = moment()
  let start = ''
  if (moment(startTime).isAfter(current)) {
    start = moment(startTime).format('MMM D YYYY')
  }
  return start
}

const formatEndDate = (endTime) => {
  const current = moment()
  let end = ''
  const endFormatted = moment(endTime).format('MMM D YYYY')
  if (moment(endTime).isAfter(current)) {
    end = `ends ${endFormatted}`
  } else if (current.isAfter(moment(endTime))) {
    end = `ended ${endFormatted}`
  }
  return end
}

export default class PostBody extends React.PureComponent {
  handleLinkPress = (url) => {
    const { slug, showMember, showTopic } = this.props
    urlHandler(url, showMember, showTopic, slug)
  }

  render () {
    const {
      type,
      title,
      details,
      startTime,
      endTime,
      linkPreview,
      slug,
      shouldTruncate
    } = this.props
    const decodedTitle = decode(title)
    const presentedDetails = present(
      sanitize(details)
        .replace(/\n/g, '')
        .replace(/(<p>\s*<\/p>)+/g, '')
        .replace('<p>&nbsp;</p>', ''),
      {
        slug,
        maxlength: shouldTruncate && MAX_DETAILS_LENGTH,
        noP: true
      }
    )
    const startDate = startTime && formatStartDate(startTime)
    const endDate = endTime && formatEndDate(endTime)
    let timeWindow

    if (startDate && endDate) {
      timeWindow = `${type} starts ${startDate} and ${endDate}`
    } else if (endDate) {
      timeWindow = `${type} ${endDate}`
    } else if (startDate) {
      timeWindow = `${type} starts ${startDate}`
    }

    return (
      <View style={styles.container}>
        {timeWindow &&
          <Text style={styles.resourceEndsAt}>{timeWindow}</Text>}
        <PostTitle title={decodedTitle} />
        <HTMLView
          onLinkPress={this.handleLinkPress}
          addLineBreaks={false}
          stylesheet={richTextStyles}
          textComponentProps={{ style: styles.details }}
          value={presentedDetails}
        />
        {linkPreview && <LinkPreview {...linkPreview} />}
      </View>
    )
  }
}

export function PostTitle ({ title, style }) {
  const decodedTitle = decode(title)
  return <Text style={[styles.title, style]}>{decodedTitle}</Text>
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 18
  },
  resourceEndsAt: {
    marginTop: 6,
    marginBottom: 6,
    color: white20onCaribbeanGreen,
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
