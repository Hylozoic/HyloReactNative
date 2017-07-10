import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { get } from 'lodash/fp'

import styles from '../styles'

function MenuButton (props) {
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

function mapStateToProps (state) {
  const placeholderCurrentCommunity = {
    avatarUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/josevnclch/128.jpg'
  }
  return {
    currentCommunity: placeholderCurrentCommunity
  }
}

export default connect(mapStateToProps, {})(MenuButton)
