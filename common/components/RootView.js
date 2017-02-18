import React from 'react'
import { TabBarIOS } from 'react-native'
import placeholderIcon from '../assets/placeholder-icon.png'
import NavigatorWithBar from './NavigatorWithBar'
import DrawerMenu from './DrawerMenu'
import Drawer from 'react-native-drawer'

export default class RootView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {selectedTabId: tabs[0].id}
  }

  renderTabContent (id, title) {
    return <NavigatorWithBar openDrawer={() => this.drawer.open()} variant={id}
      ref={ref => { this.selectedTab = ref }}
      navigatorProps={{initialRoute: {id: 'root', title: 'Welcome'}}} />
  }

  handleTabPress (id) {
    if (this.state.selectedTabId === id) {
      this.selectedTab.popToTop()
    } else {
      this.setState({selectedTabId: id})
    }
  }

  render () {
    const drawerMenu = <DrawerMenu close={() => this.drawer.close()}
      showPosts={() => this.selectedTab.push({id: 'myPosts'})} />

    return <Drawer ref={x => { this.drawer = x }} content={drawerMenu}
      openDrawerOffset={0.1}
      panOpenMask={0.1}
      tweenDuration={180}
      tweenEasing='easeInOutCubic'>
      <TabBarIOS>
        {tabs.map(({ id, title, icon }) =>
          <TabBarIOS.Item title={title} icon={icon} key={id}
            selected={this.state.selectedTabId === id}
            onPress={() => this.handleTabPress(id)}>
            {this.renderTabContent(id, title)}
          </TabBarIOS.Item>)}
      </TabBarIOS>
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
