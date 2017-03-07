import React, { PropTypes, Component } from 'react'
import { Button, ListView, Text, TouchableOpacity, View } from 'react-native'
import fetchGraphQL from '../util/fetchGraphQL'
import mixins from '../style/mixins'
import { delay } from 'lodash'

export default class DrawerMenu extends Component {
  constructor (props) {
    super(props)
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = {
      memberships: this.dataSource.cloneWithRows([])
    }
  }

  componentDidMount () {
    this.fetchCommunities()
  }

  fetchCommunities () {
    fetchGraphQL('{ me { memberships { community { id name } } } }')
    .then(data => {
      this.setState({
        memberships: this.dataSource.cloneWithRows(data.me.memberships)
      })
    })
  }

  resetToTop () {
    // hack to fix apparent scroll bug: https://github.com/facebook/react-native/issues/1831
    this.listView.scrollTo({x: 0,y: 1})
    this.listView.scrollTo({x: 0,y: 0})
  }

  renderHeader = () => {
    return <Text style={styles.text}>Search...</Text>
  }

  renderFooter = () => {
    const { close, showPosts, showSettings } = this.props
    return <View>
      <Button onPress={() => [showPosts(), close()]} title='Show posts' />
      <Button onPress={() => [showSettings(), delay(close, 300)]}
        title='Show settings' />
      <Button onPress={close} title='Close menu' />
    </View>
  }

  render () {
    return <ListView style={styles.menu}
        ref={listView => this.listView = listView}
        dataSource={this.state.memberships}
        renderRow={membership => <CommunityRow community={membership.community} />}
        renderHeader={this.renderHeader}
        renderFooter={this.renderFooter} />
  }
}
DrawerMenu.propTypes = {
  close: PropTypes.func,
  showPosts: PropTypes.func,
  showSheet: PropTypes.func
}

function CommunityRow ({ community }, { navigate }) {
  const showCommunity = () => {}
    //navigate({title: 'Community', component: Post, props: {post}})

  return <View style={styles.communityRow}>
    <TouchableOpacity onPress={showCommunity}>
      <Text style={styles.text}>{community.name}</Text>
    </TouchableOpacity>
  </View>
}
CommunityRow.contextTypes = {navigate: React.PropTypes.func}

const styles = {
  menu: {
    ...mixins.belowStatusBar,
    backgroundColor: '#2c4059',
    padding: 10,
    flex: 1
  },
  communityRow: {
    padding: 10
  },
  text: {
    color: 'white'
  }
}
