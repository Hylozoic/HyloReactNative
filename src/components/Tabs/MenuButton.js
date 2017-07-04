import React from 'react'
import { TouchableOpacity, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { get } from 'lodash/fp'

import getMe from '../../store/selectors/getMe'

function MenuButton (props) {
  function drawerOpen () {
    props.navigation.navigate('DrawerOpen')
  }

  const { currentUser } = props
  // TODO replace with hylo logo
  const defaultAvatarUrl = 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'

  if (currentUser) {
    return <TouchableOpacity onPress={drawerOpen}>
      <Image
        source={{uri: get('avatarUrl', currentUser)}}
        style={styles.avatar}
      />
    </TouchableOpacity>
  }
  return <TouchableOpacity onPress={drawerOpen}>
    <Image
      source={{uri: defaultAvatarUrl}}
      style={styles.avatar}
    />
  </TouchableOpacity>
}

function mapStateToProps (state) {
  const currentUser = getMe(state)
  return {
    currentUser
  }
}

export default connect(mapStateToProps, {})(MenuButton)

const styles = {
  avatar: {
    marginLeft: 20,
    width: 40,
    height: 40,
    borderRadius: 20
  },
  menuText: {
    marginLeft: 20
  }
}
