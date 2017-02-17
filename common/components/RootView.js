import React, { Component } from 'react'
import {
  Navigator,
  TabBarIOS,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import WelcomeScene from './WelcomeScene'
import MyPosts from './MyPosts'
import mixins from '../style/mixins'
import placeholderIcon from '../assets/placeholder-icon.png'

const router = (route, navigator) => {
  switch (route.name) {
    case 'root':
      return <WelcomeScene
        showMyPosts={() => {
          navigator.push({
            title: 'Your Posts',
            name: 'myPosts',
            index: route.index + 1
          })
        }} />
    case 'myPosts':
      return <MyPosts title={route.title} />
  }
}

const tabs = [
  {id: 'home', title: 'Home', icon: placeholderIcon},
  // {id: 'events', title: 'Events', icon: placeholderIcon},
  // {id: 'projects', title: 'Projects', icon: placeholderIcon},
  {id: 'members', title: 'Members', icon: placeholderIcon},
  {id: 'topics', title: 'Topics', icon: placeholderIcon}
]

export default class RootView extends Component {

  constructor (props) {
    super(props)
    this.state = {selectedTab: tabs[0].id}
  }

  renderTabContent (id, title) {
    return <View style={styles.tabView}>
      <Text>{id}: {title}</Text>
    </View>
  }

  selectTab (id) {
    this.setState({selectedTab: id})
  }

  render () {
    return <TabBarIOS>
      {tabs.map(({ id, title, icon }) =>
        <TabBarIOS.Item title={title} icon={icon} key={id}
          selected={this.state.selectedTab === id}
          onPress={() => this.selectTab(id)}>
          {this.renderTabContent(id, title)}
        </TabBarIOS.Item>)}
    </TabBarIOS>

    // const routeMapper = {
    //   LeftButton: (route, navigator, index, navState) => {
    //     if (route.index === 0) {
    //       return null
    //     }
    //     return <TouchableOpacity onPress={() => navigator.pop()}>
    //       <Text style={styles.navigationLeftButton}>&lt; Back</Text>
    //     </TouchableOpacity>
    //   },
    //   RightButton: (route, navigator, index, navState) => {
    //     return null
    //   },
    //   Title: (route, navigator, index, navState) => {
    //     return <Text style={styles.navigationTitle}>{route.title}</Text>
    //   }
    // }
    //
    // return <Navigator
    //   initialRoute={{name: 'root', title: 'Welcome', index: 0}}
    //   renderScene={router}
    //   navigationBar={<Navigator.NavigationBar
    //     style={styles.navigationBar}
    //     routeMapper={routeMapper} />} />
  }
}

const styles = {
  navigationBar: {
    backgroundColor: '#22bf99'
  },
  navigationTitle: {
    ...mixins.navigationText
  },
  navigationLeftButton: {
    ...mixins.navigationText,
    paddingLeft: 10,
    paddingRight: 10
  },
  tabView: {
    ...mixins.belowStatusBar,
    paddingLeft: 10,
    paddingRight: 10
  }
}
