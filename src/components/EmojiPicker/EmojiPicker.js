import React, { useState } from 'react'
import data from 'emoji-mart-native/data/apple.json'
import { NimblePicker } from 'emoji-mart-native'
import { View, Text, TouchableOpacity, Modal } from 'react-native'
import Icon from 'components/Icon'
import { bigStone } from 'style/colors'

export default function EmojiPicker (props) {
  const { handleRemoveReaction, myEmojis, handleReaction, forReactions = true, emoji, modalOpened = false, onRequestClose, includePicker = false } = props
  const [modalOpen, setModalOpen] = useState(modalOpened)

  const handleClick = (data) => {
    const selectedEmoji = data.native
    if (myEmojis.includes(selectedEmoji)) {
      handleRemoveReaction(selectedEmoji)
    } else {
      handleReaction(selectedEmoji)
    }
    onRequestClose && onRequestClose()
    setModalOpen(!modalOpen)
    return true
  }

  const handleSelection = (data) => {
    const selectedEmoji = data.native
    handleReaction(selectedEmoji)
    onRequestClose && onRequestClose()
    setModalOpen(!modalOpen)
  }

  const toggleModalOpen = (evt) => setModalOpen(!modalOpen)

  return forReactions
    ? (
      <View>
        {includePicker &&
          <TouchableOpacity onPress={toggleModalOpen} hitSlop={{ top: 15, left: 20, bottom: 20, right: 20 }}>
            <View>
              <Icon style={{ marginLeft: 10, fontSize: 16, color: bigStone }} name='Smiley' />
            </View>
          </TouchableOpacity>}
        <Modal transparent visible={modalOpened || modalOpen} animationType='slide' onRequestClose={onRequestClose}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.75)', position: 'relative', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {modalOpen &&
              <View>
                <NimblePicker set='apple' data={data} {...props} style={{ zIndex: 20 }} theme='light' showCloseButton onPressClose={onRequestClose || toggleModalOpen} onSelect={handleClick} />
              </View>}
            </View>
        </Modal>
      </View>
    )
    : (
      <TouchableOpacity onPress={toggleModalOpen} hitSlop={{ top: 15, left: 20, bottom: 20, right: 20 }}>
        <View>
          <Text>{emoji || '?'}</Text>
          {modalOpen &&
            <View>
              <NimblePicker set='apple' data={data} {...props} style={{ zIndex: 20 }} theme='light' showCloseButton onPressClose={onRequestClose || toggleModalOpen} onSelect={handleSelection} />
            </View>}
        </View>
      </TouchableOpacity>
    )
}
