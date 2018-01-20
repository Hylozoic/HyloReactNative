import React from 'react'
import {
  Text
} from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import { caribbeanGreen, white, white60onCaribbeanGreen } from 'style/colors'

export default function createCommunityHeader (title, navigation) {
  return {
    title: <Text style={styles.headerTitle}>{title}</Text>,
    color: white,
    fontSize: 10,
    headerStyle: {
      backgroundColor: caribbeanGreen,
      borderBottomWidth: 0,
      shadowRadius: 0,
      shadowOffset: {
        height: 0
      },
      elevation: 0
    },
    headerBackgroundColor: caribbeanGreen,
    headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} tintColor={white60onCaribbeanGreen} />
  }
}

const styles = {
  headerTitle: {
    color: white,
    fontSize: 12,
    fontWeight: 'bold'
  }
}
