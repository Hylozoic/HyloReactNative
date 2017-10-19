import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, ListView, Text, TouchableOpacity, View } from 'react-native'
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

  componentDidMount () {
    this.setState({
      memberships: this.dataSource.cloneWithRows(
        [{community: {id: 'all', name: 'all communities'}}]
        .concat(this.props.memberships))
    })
  }

  // FIXME: I don't think this function is used anywhere
  resetToTop () {
    // hack to fix apparent scroll bug: https://github.com/facebook/react-native/issues/1831
    this.listView.scrollTo({x: 0, y: 1})
    this.listView.scrollTo({x: 0, y: 0})
  }

  render () {
    const {
      name, avatarUrl, selectCommunity, goToMyProfile, showSettings
    } = this.props

    return <View style={styles.parent}>
      <ListView style={styles.menu}
        ref={ref => { this.listView = ref }}
        dataSource={this.state.memberships}
        renderRow={({ community }) =>
          <CommunityRow community={community}
            onPress={() => selectCommunity(community)} />}
        enableEmptySections />
      <View style={styles.footer}>
        <TouchableOpacity onPress={goToMyProfile} style={styles.avatar}>
          <Image source={{uri: avatarUrl}}
            style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.footerContent}>
          <Text style={styles.footerTopText} numberOfLines={1}>
            Hello, {name}!
          </Text>
          <View style={styles.footerButtons}>
            <TextButton text='Settings' onPress={showSettings} />
          </View>
        </View>
      </View>
    </View>
  }
}
DrawerMenu.propTypes = {
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  memberships: PropTypes.array,
  selectCommunity: PropTypes.func.isRequired,
  goToMyProfile: PropTypes.func.isRequired,
  showSettings: PropTypes.func.isRequired
}

export function TextButton ({ text, onPress }) {
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
