import React from 'react'
import { Platform, TabBarIOS } from 'react-native'
import NavigatorWithBar from './NavigatorWithBar'
import DrawerMenu from './DrawerMenu'
import WelcomeScene from './WelcomeScene'
import MyPosts from './MyPosts'
import Settings from './Settings'
import Drawer from 'react-native-drawer'
import TabNavigator from 'react-native-tab-navigator'
import Icon from './Icon'

export default class DrawerAndTabs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {selectedTabId: tabs[0].id, isAtTop: true}
    this.tabs = {}
    this.TabBar = Platform.OS === 'ios' ? TabBarIOS : TabNavigator
  }

  renderTabContent (id, title) {
    const unsetIsAtTop = () => {
      if (this.state.isAtTop) this.setState({isAtTop: false})
    }
    const setIsAtTop = () => {
      if (!this.state.isAtTop) this.setState({isAtTop: true})
    }

    return <NavigatorWithBar openDrawer={this.openDrawer} variant={id}
      ref={ref => { this.tabs[id] = ref }}
      navigatorProps={{
        initialRoute: {title: 'Welcome', component: WelcomeScene}
      }}
      onNavigate={unsetIsAtTop}
      onBackToTop={setIsAtTop} />
  }

  openDrawer = () => {
    this.drawer.open()
    this.drawerMenu.getWrappedInstance().resetToTop()
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

  makeTabBarItem = ({ id, title, icon }) => {
    const sharedProps = {
      title,
      key: id,
      selected: this.state.selectedTabId === id,
      onPress: () => this.handleTabPress(id)
    }
    if (Platform.OS === 'ios') {
      return <Icon.TabBarItemIOS {...sharedProps} iconName={icon}>
        {this.renderTabContent(id, title)}
      </Icon.TabBarItemIOS>
    } else {
      return <TabNavigator.Item {...sharedProps}
        renderIcon={() => <Icon name={icon} size={25} />}
        renderSelectedIcon={() =>
          <Icon name={icon} size={25} color='azureRadiance' />}>
        {this.renderTabContent(id, title)}
      </TabNavigator.Item>
    }
  }

  render () {
    const { isAtTop, selectedTabId } = this.state
    const drawerMenu = <DrawerMenu close={() => this.drawer.close()}
      ref={x => { this.drawerMenu = x }}
      showPosts={() => this.tabs[selectedTabId].push({component: MyPosts})}
      showSettings={() => this.props.rootNavigator.push({
        component: Settings,
        props: {name: 'you'}
      })} />

    return <Drawer ref={x => { this.drawer = x }} content={drawerMenu}
      openDrawerOffset={0.1}
      panOpenMask={0.1}
      disabled={!isAtTop}
      tweenDuration={250}
      tweenEasing='easeInOutCubic'
      tapToClose>
      <this.TabBar>{tabs.map(this.makeTabBarItem)}</this.TabBar>
    </Drawer>
  }
}

const tabs = [
  {id: 'home', title: 'Home', icon: 'Home'},
  // {id: 'events', title: 'Events', icon: placeholderIcon},
  // {id: 'projects', title: 'Projects', icon: placeholderIcon},
  {id: 'members', title: 'Members', icon: 'Members'},
  {id: 'topics', title: 'Topics', icon: 'Topics'}
]
