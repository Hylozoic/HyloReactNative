import React from 'react'
import { TabBarIOS } from 'react-native'
import placeholderIcon from '../assets/placeholder-icon.png'
import NavigatorWithBar from './NavigatorWithBar'
import DrawerMenu from './DrawerMenu'
import Drawer from 'react-native-drawer'

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

    return <Drawer ref={x => { this.drawer = x }} content={drawerMenu}
      openDrawerOffset={0.1}
      panOpenMask={0.1}
      disabled={!isAtTop}
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
