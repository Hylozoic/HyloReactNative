import React, { PropTypes, Component } from 'react'
import { Image, ListView, Text, TouchableOpacity, View } from 'react-native'
import mixins from '../../style/mixins'
import { delay } from 'lodash'
import { bigStone, rhino } from '../../style/colors'
import { get, isEmpty } from 'lodash/fp'

export default class DrawerMenu extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      logout: PropTypes.func.isRequired
    }).isRequired,
    showPosts: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = {
      memberships: this.dataSource.cloneWithRows([])
    }
  }

  componentDidUpdate (prevProps) {
    if (isEmpty(prevProps.memberships) && !isEmpty(this.props.memberships)) {
      this.setState({
        memberships: this.dataSource.cloneWithRows(this.props.memberships)
      })
    }
  }

  resetToTop () {
    // hack to fix apparent scroll bug: https://github.com/facebook/react-native/issues/1831
    this.listView.scrollTo({x: 0, y: 1})
    this.listView.scrollTo({x: 0, y: 0})
  }

  render () {
    const { close, showSettings, actions: { logout }, currentUser } = this.props
    const name = get('name', currentUser) || 'you'

    return <View style={styles.parent}>
      <View style={styles.header}>
        <Text style={styles.text}>Search...</Text>
      </View>
      <ListView style={styles.menu}
        ref={ref => { this.listView = ref }}
        dataSource={this.state.memberships}
        renderRow={membership => <CommunityRow community={membership.community} />}
        enableEmptySections />
      <View style={styles.footer}>
        <Text style={styles.footerTopText} numberOfLines={1}>
          Hello, {name}!
        </Text>
        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}
            onPress={() => [showSettings(), delay(close, 300)]}>
            <Text style={styles.footerText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={logout}>
            <Text style={styles.footerText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  }
}
DrawerMenu.propTypes = {
  close: PropTypes.func,
  showPosts: PropTypes.func,
  showSheet: PropTypes.func
}

function CommunityRow ({ community }, { navigate }) {
  const showCommunity = () => {
    console.log(`clicked on ${community.name}`)
  }
    // navigate({title: 'Community', component: Post, props: {post}})

  return <View style={styles.communityRow}>
    <TouchableOpacity onPress={showCommunity} style={styles.communityRowTouchable}>
      <Image source={{uri: community.avatarUrl}} style={styles.communityAvatar} />
      <Text style={styles.text}>{community.name}</Text>
    </TouchableOpacity>
  </View>
}
CommunityRow.contextTypes = {navigate: React.PropTypes.func}

const styles = {
  parent: {
    ...mixins.belowStatusBar,
    flex: 1,
    backgroundColor: rhino
  },
  menu: {
    padding: 10,
    flex: 1
  },
  header: {
    height: 40
  },
  footer: {
    backgroundColor: bigStone,
    padding: 10,
    height: 64
  },
  footerTopText: {
    color: 'white',
    fontSize: 16
  },
  footerText: {
    color: 'white',
    fontSize: 14
  },
  footerButtons: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 6
  },
  footerButton: {
    marginRight: 15
  },
  communityRow: {
    padding: 10
  },
  communityRowTouchable: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  communityAvatar: {
    height: 30,
    width: 30,
    marginRight: 8,
    borderRadius: 4
  },
  text: {
    color: 'white'
  }
}
