import React, { useState } from 'react'
import data from 'emoji-mart-native/data/apple.json'
import { NimblePicker } from 'emoji-mart-native'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'components/Icon'
import { athensGrayDark } from 'style/colors'

export default function EmojiPicker (props) {
  const { handleRemoveReaction, myEmojis, handleReaction, forReactions = true, emoji } = props
  const [modalOpen, setModalOpen] = useState(false)
  const handleClick = (data) => {
    const selectedEmoji = data.native
    if (myEmojis.includes(selectedEmoji)) {
      handleRemoveReaction(selectedEmoji)
    } else {
      handleReaction(selectedEmoji)
    }
    setModalOpen(!modalOpen)
    return true
  }

  const handleSelection = (data) => {
    const selectedEmoji = data.native
    handleReaction(selectedEmoji)
    setModalOpen(!modalOpen)
  }

  const toggleModalOpen = (evt) => setModalOpen(!modalOpen)

  return forReactions
    ? (
      <View className={props.className}>
        <TouchableOpacity onPress={toggleModalOpen} hitSlop={{ top: 15, left: 20, bottom: 20, right: 20 }}>
          <View>
            <Icon style={{ fontSize: 16, color: athensGrayDark }} name='Smiley' />
          </View>
        </TouchableOpacity>
        {modalOpen &&
          <View>
            <NimblePicker set='apple' data={data} {...props} theme='light' showCloseButton onPressClose={toggleModalOpen} onSelect={handleClick} />
          </View>}
      </View>
    )
    : (
      <TouchableOpacity onPress={toggleModalOpen} hitSlop={{ top: 15, left: 20, bottom: 20, right: 20 }}>
        <View className={props.className}>
          <Text>{emoji || '?'}</Text>
          {modalOpen &&
            <View>
              <NimblePicker set='apple' data={data} {...props} theme='light' showCloseButton onPressClose={toggleModalOpen} onSelect={handleSelection} />
            </View>}
        </View>
      </TouchableOpacity>
    )
}
