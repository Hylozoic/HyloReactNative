import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { get } from 'lodash/fp'

export default function MenuButton (props) {
  const { currentCommunity, openDrawer } = props
  // TODO replace with hylo logo
  const placeholderAvatarUrl = 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'

  if (currentCommunity) {
    return <TouchableOpacity onPress={openDrawer}>
      <Image
        source={{uri: get('avatarUrl', currentCommunity)}}
        style={styles.avatar}
      />
    </TouchableOpacity>
  }
  return <TouchableOpacity onPress={openDrawer}>
    <Image
      source={{uri: placeholderAvatarUrl}}
      style={styles.avatar}
    />
  </TouchableOpacity>
}

const styles = {
  avatar: {
    marginLeft: 10,
    width: 30,
    height: 30,
    borderRadius: 4
  }
}
