import React from 'react'
import {
  View, FlatList, Text, TouchableOpacity, TextInput, Image
} from 'react-native'
import { some, values, keys, isEmpty, debounce, size } from 'lodash/fp'

import Avatar from '../../Avatar'
import { DEFAULT_BANNER } from '../../../store/models/Community'
import { focus } from '../../../util/textInput'
import Header from '../Header'
import Icon from '../../Icon'
import Loading from '../../Loading'
import PopupMenuButton from '../../PopupMenuButton'
import LinearGradient from 'react-native-linear-gradient'
import styles from './Members.styles'
import Button from '../../Button'

export default class Members extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) =>
    Header(navigation, screenProps.currentTabName)

  fetchOrShowCached () {
    const { hasMore, members, fetchMembers } = this.props
    if (isEmpty(members) && hasMore !== false) fetchMembers()
  }

  goToInvitePeople = () => this.props.navigation.navigate('InvitePeople')

  componentDidMount () {
    this.fetchOrShowCached()
  }

  componentDidUpdate (prevProps) {
    if (this.props.screenProps.currentTabName !== 'Members') return
    if (!prevProps || prevProps.screenProps.currentTabName !== 'Members') {
      return this.fetchOrShowCached()
    }

    if (some(key => this.props[key] !== prevProps[key], [
      'slug',
      'networkSlug',
      'sortBy',
      'search'
    ])) {
      this.fetchOrShowCached()
    }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  render () {
    let {
      community, canModerate, network, members, subject, sortBy, setSort, fetchMoreMembers, isAll, pending
    } = this.props
    const sortKeys = sortKeysFactory(subject)
    const onSearch = debounce(300, text => this.props.setSearch(text))

    const actions = values(sortKeys).map((value, index) => [value, () => setSort(keys(sortKeys)[index])])

    // sort of a hack since members need to be even since it's rows of 2.  fixes flexbox
    if (size(members) % 2 > 0) members.push({id: -1})

    const header = <View>
      <Banner community={community} network={network} all={isAll} />
      {canModerate && <Button
        text='Invite People'
        style={styles.button}
        iconName={'Invite'}
        onPress={this.goToInvitePeople} />}
      <View style={styles.listControls}>
        <View style={styles.searchWrapper}>
          <Icon style={styles.searchIcon} name='Search' size={30}
            onPress={() => focus(this.searchRef)} />
          <TextInput placeholder='Search Members'
            ref={ref => { this.searchRef = ref }}
            onChangeText={onSearch}
            underlineColorAndroid='transparent' style={styles.searchInput} />
        </View>

        <PopupMenuButton actions={actions}>
          <View style={styles.sortBy}>
            <Text style={styles.sortByText}>{sortKeys[sortBy]}</Text>
            <Icon name='ArrowDown' style={styles.downArrow} />
          </View>
        </PopupMenuButton>
      </View>
    </View>

    return <View style={styles.container}>
      <FlatList
        data={members}
        numColumns='2'
        renderItem={({item}) => {
          if (item.name) {
            return <Member member={item} showMember={this.props.showMember} />
          } else {
            return <View style={styles.cell} />
          }
        }}
        onEndReached={fetchMoreMembers}
        keyExtractor={(item, index) => item.id}
        ListHeaderComponent={header}
        ListFooterComponent={pending ? <Loading /> : null}
      />
    </View>
  }
}

export function Member ({ member, showMember }) {
  return <TouchableOpacity onPress={() => showMember(member.id)}
    style={[styles.cell, styles.memberCell]} >
    <View style={styles.avatarSpacing}>
      <Avatar avatarUrl={member.avatarUrl} dimension={72} />
    </View>
    <Text style={styles.memberName}>{member.name}</Text>
    {!!member.location &&
      <Text style={styles.memberLocation}>{member.location}</Text>}
    <Text style={styles.memberBio} numberOfLines={4}>
      {member.bio}
    </Text>
  </TouchableOpacity>
}

export function Banner ({ community, network, all }) {
  let bannerUrl, name

  if (network) {
    ({ bannerUrl, name } = network)
  } else if (community) {
    ({ bannerUrl, name } = community)
  } else if (all) {
    name = 'All Communities'
    bannerUrl = DEFAULT_BANNER
  } else {
    return null
  }

  return <View style={styles.bannerContainer}>
    <Image source={{uri: bannerUrl}} style={styles.image} />
    <LinearGradient style={styles.gradient}
      colors={[
        'rgba(0, 0, 0, 0)',
        'rgba(0, 0, 0, 0.1)',
        'rgba(0, 0, 0, 0.3)',
        'rgba(0, 0, 0, 0.6)'
      ]} />
    <View style={styles.titleRow}>
      <Text style={styles.name}>{name}</Text>
    </View>
  </View>
}

// these keys must match the values that hylo-node can handle
function sortKeysFactory (subject) {
  const sortKeys = {
    name: 'Name',
    location: 'Location'
  }
  if (subject !== 'network') sortKeys['join'] = 'Newest'
  return sortKeys
}
