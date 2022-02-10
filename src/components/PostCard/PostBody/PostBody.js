import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import HTMLView from 'react-native-htmlview'
import { decode } from 'ent'
import { isEmpty } from 'lodash/fp'
import { TextHelpers } from 'hylo-shared'
import urlHandler from 'navigation/linking/urlHandler'
import LinkPreview from 'components/PostCard/LinkPreview'
import { caribbeanGreen, white, white20onCaribbeanGreen } from 'style/colors'
import richTextStyles from 'style/richTextStyles'
import Icon from 'components/Icon'
import { humanResponse, RESPONSES } from 'store/models/EventInvitation'
import PopupMenuButton from 'components/PopupMenuButton'

const MAX_DETAILS_LENGTH = 144

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
      myEventResponse,
      respondToEvent,
      slug,
      shouldTruncate
    } = this.props
    const decodedTitle = decode(title)
    const presentedDetails = TextHelpers.present(details
      .replace(/\n/g, '')
      .replace(/(<p>\s*<\/p>)+/g, '')
      .replace('<p>&nbsp;</p>', ''),
    {
      slug,
      maxlength: shouldTruncate && MAX_DETAILS_LENGTH,
      noP: true
    })

    return (
      <View style={styles.container}>
        {startTime && endTime && (
          <Text style={styles.resourceEndsAt}>{TextHelpers.formatDatePair(startTime, endTime)}</Text>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <PostTitle title={decodedTitle} />
          {type === 'event' && !!respondToEvent &&
            <EventRSVP myEventResponse={isEmpty(myEventResponse) ? RESPONSES.NO : myEventResponse} respondToEvent={respondToEvent} />}
        </View>
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

export function EventRSVP ({ myEventResponse, respondToEvent }) {
  const actions = [
    [humanResponse(RESPONSES.YES), () => respondToEvent(RESPONSES.YES)],
    [humanResponse(RESPONSES.INTERESTED), () => respondToEvent(RESPONSES.INTERESTED)],
    [humanResponse(RESPONSES.NO), () => respondToEvent(RESPONSES.NO)]
  ]

  return (
    <PopupMenuButton actions={actions}>
      <View style={styles.RSVPOption}>
        <Text style={styles.RSVPOptionText}>{humanResponse(myEventResponse)} |</Text>
        <Icon name='ArrowDown' color={white} style={styles.RSVPOptionText} />
      </View>

    </PopupMenuButton>
  )
}

export function PostTitle ({ title, style }) {
  const decodedTitle = decode(title)
  return <Text style={[styles.title, style]}>{decodedTitle}</Text>
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 0
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
    marginBottom: 8,
    flex: 1
  },
  details: {
    color: '#5D757A',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: 'Circular-Book'
  },
  RSVPOption: {
    backgroundColor: caribbeanGreen,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  RSVPOptionText: {
    color: white,
    fontSize: 12
  },
  RSVPOptionIcon: {
    fontSize: 14,
    marginTop: 1
  }
})
