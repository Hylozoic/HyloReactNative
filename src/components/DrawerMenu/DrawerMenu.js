import React, { PropTypes, Component } from 'react'
import { Image, ListView, Text, TouchableOpacity, View } from 'react-native'
import { delay } from 'lodash'
import { get, isEmpty } from 'lodash/fp'
import Icon from '../Icon'
import styles from './DrawerMenu.styles'

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
    const { close, showSettings, logout, currentUser } = this.props
    const name = get('name', currentUser) || 'you'

    return <View style={styles.parent}>
      <View style={styles.header}>
        <View style={styles.search}>
          <Icon name='Search' style={styles.searchIcon} />
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
            <TextButton text='Log out' onPress={logout} />
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
