import React, { PropTypes, Component } from 'react'
import { Image, ListView, Text, TouchableOpacity, View } from 'react-native'
import mixins from '../../style/mixins'
import { delay } from 'lodash'
import { bigStone, mirage, rhino } from '../../style/colors'
import { get, isEmpty } from 'lodash/fp'

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
    const { close, showSettings, currentUser } = this.props
    const name = get('name', currentUser) || 'you'

    return <View style={styles.parent}>
      <View style={styles.header}>
        <View style={styles.search}>
          <Text style={styles.searchText}>Search your communities</Text>
        </View>
      </View>
      <ListView style={styles.menu}
        ref={ref => { this.listView = ref }}
        dataSource={this.state.memberships}
        renderRow={membership => <CommunityRow community={membership.community} />}
        enableEmptySections />
      <View style={styles.footer}>
        <Image source={{uri: get('avatarUrl', currentUser)}} style={styles.avatar} />
        <View>
          <Text style={styles.footerTopText} numberOfLines={1}>
            Hello, {name}!
          </Text>
          <View style={styles.footerButtons}>
            <TextButton text='View Profile' onPress={() => {}} />
            <TextButton text='Settings' onPress={() => [showSettings(), delay(close, 300)]} />
          </View>
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

function TextButton ({ text, onPress }) {
  return <TouchableOpacity onPress={onPress} style={styles.footerButton}>
    <Text style={{color: 'white', fontSize: 14}}>{text}</Text>
  </TouchableOpacity>
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
    flex: 1
  },
  header: {
    height: 40
  },
  search: {
    backgroundColor: mirage,
    height: 36,
    borderRadius: 36,
    marginLeft: 15,
    marginRight: 20,
    borderWidth: 0.5,
    borderColor: 'black',
    marginBottom: 0
  },
  searchText: {
    lineHeight: 34,
    marginLeft: 15,
    marginRight: 15,
    color: 'white',
    opacity: 0.5,
    fontSize: 15
  },
  footer: {
    backgroundColor: bigStone,
    padding: 10,
    height: 64,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  avatar: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20
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
    justifyContent: 'space-between',
    marginTop: 4
  },
  footerButton: {
    marginRight: 30
  },
  communityRow: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20
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
