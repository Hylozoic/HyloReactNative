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
  if (currentUser) {
    return <TouchableOpacity onPress={drawerOpen}>
      <Image
        source={{uri: get('avatarUrl', currentUser)}}
        style={styles.avatar}
      />
    </TouchableOpacity>
  }
  return <TouchableOpacity>
    <Text onPress={drawerOpen}>Menu</Text>
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
    marginRight: 20,
    width: 40,
    height: 40,
    borderRadius: 20
  }
}
