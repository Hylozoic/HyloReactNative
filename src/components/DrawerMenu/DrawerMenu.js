import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, ListView, Text, TouchableOpacity, View } from 'react-native'
import { get, isEmpty } from 'lodash/fp'
import Icon from '../Icon'
import AllFeedsIcon from '../AllFeedsIcon'
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
        memberships: this.dataSource.cloneWithRows(
          [{community: {id: 'all', name: 'All Communities'}}]
          .concat(this.props.memberships))
      })
    }
  }

  resetToTop () {
    // hack to fix apparent scroll bug: https://github.com/facebook/react-native/issues/1831
    this.listView.scrollTo({x: 0, y: 1})
    this.listView.scrollTo({x: 0, y: 0})
  }

  render () {
    const { currentUser, navigation, changeCommunity } = this.props
    const name = get('name', currentUser) || 'you'
    const showSettings = () => navigation.navigate('UserSettings', {name})

    const selectCommunity = community => {
      changeCommunity(community.id)
      navigation.navigate('DrawerClose')
    }

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
        renderRow={({ community }) =>
          <CommunityRow community={community}
            onPress={() => selectCommunity(community)} />}
        enableEmptySections />
      <View style={styles.footer}>
        <Image source={{uri: get('avatarUrl', currentUser)}} style={styles.avatar} />
        <View style={styles.footerContent}>
          <Text style={styles.footerTopText} numberOfLines={1}>
            Hello, {name}!
          </Text>
          <View style={styles.footerButtons}>
            <TextButton text='View Profile' onPress={() => {}} />
            <TextButton text='Settings' onPress={showSettings} />
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

export function CommunityRow ({ community, onPress }) {
  const all = community.id === 'all'
  return <View style={styles.communityRow}>
    <TouchableOpacity onPress={onPress} style={styles.communityRowTouchable}>
      {all
        ? <AllFeedsIcon style={styles.allFeedsIcon} />
        : <Image source={{uri: community.avatarUrl}} style={styles.communityAvatar} />}
      <Text style={[styles.text, styles.communityRowText]} ellipsizeMode='tail'
        numberOfLines={1}>
        {community.name}
      </Text>
    </TouchableOpacity>
  </View>
}
