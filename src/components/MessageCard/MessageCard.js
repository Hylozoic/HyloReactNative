import React from 'react'
import PropTypes from 'prop-types'
import { Text, View } from 'react-native'
import { TextHelpers } from 'hylo-shared'
import HyloHTML from 'components/HyloHTML'
import Avatar from 'components/Avatar'
import styles from './MessageCard.style'

export default function MessageCard ({ message }) {
  const { createdAt, creator, suppressCreator, suppressDate, text } = message
  // TODO: Makrdown is being used on both Web and Mobile as some messages are HTML
  //       and others are plain text with purposeful linebreaks.
  const presentedText = TextHelpers.presentHTML(TextHelpers.markdown(text))
  const textBaseStyle = Object.assign({}, { marginTop: 3 }, suppressCreator && styles.marginTopNoCreator)
  const classesStyles = { p: { margin: 0, padding: 0 } }

  return (
    <View style={[styles.container, suppressCreator && styles.padLeftNoAvatar]}>
      {!suppressCreator && (
        <Avatar avatarUrl={creator.avatarUrl} />
      )}
      <View style={[styles.body, suppressCreator && styles.padTopNoCreator]}>
        {!suppressCreator && (
          <Text style={styles.name}>{creator.name}</Text>
        )}
        <HyloHTML
          baseStyle={textBaseStyle}
          classesStyles={classesStyles}
          html={presentedText}
        />
        {!suppressDate && (
          <Text style={styles.date}>{createdAt}</Text>
        )}
      </View>
    </View>
  )
}

MessageCard.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.any,
    createdAt: PropTypes.string,
    creator: PropTypes.shape({
      id: PropTypes.any,
      name: PropTypes.string,
      avatarUrl: PropTypes.string
    }),
    suppressCreator: PropTypes.bool,
    suppressDate: PropTypes.bool,
    text: PropTypes.string
  })
}
