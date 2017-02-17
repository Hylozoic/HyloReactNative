import React from 'react'
import {
  TabBarIOS,
  Text,
  View
} from 'react-native'
import mixins from '../style/mixins'
import placeholderIcon from '../assets/placeholder-icon.png'
import Home from './Home'

const tabs = [
  {id: 'home', title: 'Home', icon: placeholderIcon},
  // {id: 'events', title: 'Events', icon: placeholderIcon},
  // {id: 'projects', title: 'Projects', icon: placeholderIcon},
  {id: 'members', title: 'Members', icon: placeholderIcon},
  {id: 'topics', title: 'Topics', icon: placeholderIcon}
]

export default class RootView extends React.Component {

  constructor (props) {
    super(props)
    this.state = {selectedTab: tabs[0].id}
  }

  renderTabContent (id, title) {
    if (id === 'home') return <Home />

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
  }
}

const styles = {
  tabView: {
    ...mixins.belowStatusBar,
    paddingLeft: 10,
    paddingRight: 10
  }
}
