import React from 'react'
import { Platform, TabBarIOS, View } from 'react-native'
import { TabNavigator, DrawerNavigator, StackNavigator } from "react-navigation"
import {
  Text,
  TouchableOpacity
} from 'react-native'

import DrawerMenu from './DrawerMenu'
import WelcomeScene from './WelcomeScene'
import MyPosts from './MyPosts'
import Feed from './Feed'
import Settings from './Settings'
import Drawer from 'react-native-drawer'
import Icon from './Icon'
import Post from './Post'
import NavigatorWithBar from './NavigatorWithBar'

export default class DrawerAndTabs extends React.Component {
  constructor (props) {
    super(props)
  }

  openDrawer = () => {
    this.drawer.open()
    this.drawerMenu.getWrappedInstance().resetToTop()
  }

  render () {
    const drawerMenu = <DrawerMenu close={() => this.drawer.close()}
      ref={x => { this.drawerMenu = x }}
    />

    return <Drawer ref={x => { this.drawer = x }} content={drawerMenu}
      openDrawerOffset={0.1}
      panOpenMask={0.1}
      tweenDuration={250}
      tweenEasing='easeInOutCubic'
      tapToClose>
      <NavigatorWithBar />
    </Drawer>
  }
}
