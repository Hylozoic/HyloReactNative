import React from 'react'
import { View, FlatList, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import Header from '../Header'
import Avatar from '../../Avatar'
import PopupMenuButton from '../../PopupMenuButton'
import Icon from '../../Icon'
import { DEFAULT_BANNER } from '../../../store/models/Community'
import styles from './Members.styles'
import { some, values, keys, isUndefined, isEmpty, debounce } from 'lodash/fp'
import { focus } from '../../../util/textInput'
const title = 'Members'

export default class Members extends React.Component {
  static navigationOptions = ({navigation}) => (Header(navigation, title))

  fetchOrShowCached () {
    const { hasMore, members, fetchMembers } = this.props
    if (isEmpty(members) && hasMore !== false) fetchMembers()
  }

  componentDidMount () {
    this.fetchOrShowCached()
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return

    if (some(key => this.props[key] !== prevProps[key], [
        'slug',
        'networkSlug',
        'sortBy',
        'search',
      ])) {
      this.fetchOrShowCached()
    }
  }

  render () {
    const { community, subject, sortBy, setSort, fetchMoreMembers } = this.props

    const sortKeys = sortKeysFactory(subject)

    const onSearch = debounce(300, text => {
      this.props.setSearch(text)
    })

    const onSelect = (action, index) => {
      if (!isUndefined(index)) {
        setSort(keys(sortKeys)[index])
      }
    }

    let { members } = this.props

    // Members need to be even since it's rows of 2
    if (members.length % 2 > 0) {
      members.push({id: -1})
    }

    const headerComponent = <View>
      <Banner community={community} all={!community} />
      <View style={styles.listControls}>
        <View style={styles.searchWrapper}>
          <Icon style={styles.searchIcon} name='Search' size={30} onPress={() => focus(this.searchRef)}/>
          <TextInput placeholder='Search Members'
                     ref={ref => this.searchRef = ref}
                     onChangeText={onSearch}
                     underlineColorAndroid='transparent' style={styles.searchInput} />
        </View>

        <PopupMenuButton actions={values(sortKeys)} onSelect={onSelect}>
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
            return <Member member={item} showMember={this.props.showMember}/>
          } else {
            return <View style={styles.cell} />
          }
        }}
        onEndReached={fetchMoreMembers}
        keyExtractor={(item, index) => item.id}
        ListHeaderComponent={headerComponent}
      />
    </View>
  }
}

function Member ({ member, showMember }) {
  return <TouchableOpacity onPress={() => showMember(member.id)}
                           style={[styles.cell, styles.memberCell]} >
    <View style={styles.avatarSpacing}>
      <Avatar avatarUrl={member.avatarUrl} dimension={72} />
    </View>
    <Text style={styles.memberName}>{member.name}</Text>
    {member.location && <Text style={styles.memberLocation}>{member.location}</Text>}
    <Text style={styles.memberBio}>{member.bio}</Text>
  </TouchableOpacity>
}

function Banner ({ community, all }) {
  let bannerUrl, name

  if (all) {
    name = 'All Communities'
    bannerUrl = DEFAULT_BANNER
  } else if (!community) {
    return null
  } else {
    ({ bannerUrl, name } = community)
  }

  return <View style={styles.bannerContainer}>
    <Image source={{uri: bannerUrl}} style={styles.image} />
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
