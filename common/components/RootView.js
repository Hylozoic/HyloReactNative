import React from 'react'
import { Image, Platform, TabBarIOS } from 'react-native'
import placeholderIcon from '../assets/placeholder-icon.png'
import NavigatorWithBar from './NavigatorWithBar'
import DrawerMenu from './DrawerMenu'
import Drawer from 'react-native-drawer'
import TabNavigator from 'react-native-tab-navigator'

export default class RootView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {selectedTabId: tabs[0].id, isAtTop: true}
    this.tabs = {}
  }

  renderTabContent (id, title) {
    const unsetIsAtTop = () => {
      if (this.state.isAtTop) this.setState({isAtTop: false})
    }

    return <NavigatorWithBar openDrawer={() => this.drawer.open()} variant={id}
      ref={ref => { this.tabs[id] = ref }}
      navigatorProps={{initialRoute: {id: 'root', title: 'Welcome'}}}
      onNavigate={unsetIsAtTop} />
  }

  handleTabPress (id) {
    const { selectedTabId } = this.state
    if (selectedTabId === id) {
      this.tabs[selectedTabId].popToTop()
      this.setState({isAtTop: true})
    } else {
      this.setState({selectedTabId: id})
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { selectedTabId } = this.state
    if (selectedTabId !== prevState.selectedTabId) {
      this.setState({isAtTop: this.tabs[selectedTabId].isAtTop()})
    }
  }

  render () {
    const { isAtTop, selectedTabId } = this.state
    const drawerMenu = <DrawerMenu close={() => this.drawer.close()}
      showPosts={() => this.tabs[selectedTabId].push({id: 'myPosts'})} />

    const TabBar = Platform.OS === 'ios' ? TabBarIOS : TabNavigator

    const makeTabBarItem = ({ id, title, icon }) => {
      const sharedProps = {
        title,
        key: id,
        selected: this.state.selectedTabId === id,
        onPress: () => this.handleTabPress(id)
      }
      if (Platform.OS === 'ios') {
        return <TabBar.Item {...sharedProps} icon={icon}>
          {this.renderTabContent(id, title)}
        </TabBar.Item>
      } else {
        return <TabNavigator.Item {...sharedProps}
          renderIcon={() => <Image source={icon} />}
          renderSelectedIcon={() => <Image source={icon} />}>
          {this.renderTabContent(id, title)}
        </TabNavigator.Item>
      }
    }

    return <Drawer ref={x => { this.drawer = x }} content={drawerMenu}
      openDrawerOffset={0.1}
      panOpenMask={0.1}
      disabled={!isAtTop}
      tweenDuration={180}
      tweenEasing='easeInOutCubic'>
      <TabBar>{tabs.map(makeTabBarItem)}</TabBar>
    </Drawer>
  }
}

const tabs = [
  {id: 'home', title: 'Home', icon: placeholderIcon},
  // {id: 'events', title: 'Events', icon: placeholderIcon},
  // {id: 'projects', title: 'Projects', icon: placeholderIcon},
  {id: 'members', title: 'Members', icon: placeholderIcon},
  {id: 'topics', title: 'Topics', icon: placeholderIcon}
]
