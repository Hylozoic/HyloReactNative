import React from 'react'
import DrawerMenu from './DrawerMenu'
import Drawer from 'react-native-drawer'

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

import { TabNavigator, StackNavigator } from "react-navigation"

import WelcomeScene from './WelcomeScene'
import MyPosts from './MyPosts'
import Post from './Post'

function TestComponent () {
  return <View style={{flex: 1, backgroundColor: 'red'}}><Text>Test</Text></View>
}

function TestComponent2 () {
  return <View style={{flex: 1, backgroundColor: 'blue'}}><Text>Test</Text></View>
}

const StackNav = StackNavigator({
  Home1: { screen: MyPosts },
  Post: { screen: Post }
})

const MembersNav = StackNavigator({
  Home2: { screen: WelcomeScene },
  MembersPosts: { screen: MyPosts },
  Post: { screen: Post }
})

const TopicsNav = StackNavigator({
  Home3: { screen: WelcomeScene },
  MembersPosts: { screen: MyPosts },
  Post: { screen: Post }
})

const TabNav = TabNavigator({
  Home: { screen: StackNav },
  Members: { screen: MembersNav },
  Topics: { screen: TopicsNav }
}, {
  tabBarPosition: 'bottom'
})
