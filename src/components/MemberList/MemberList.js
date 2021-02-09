import React from 'react'
import {
  get, isFunction, isEqual, filter, some, values,
  keys, isEmpty, debounce, size
} from 'lodash/fp'
import {
  View, FlatList, Text, TouchableOpacity, TextInput
} from 'react-native'
import { useScrollToTop } from '@react-navigation/native'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import PopupMenuButton from 'components/PopupMenuButton'
import styles from './MemberList.styles'
import SearchBar from 'components/SearchBar'

export class MemberList extends React.Component {
  static defaultProps = {
    // For all
    members: [],
    search: null,
    children: '',
    pending: false,
    hideSortOptions: false,
    sortBy: null,
    // For server-based searches only
    isServerSearch: false,
    sortKeys: null,
    hasMore: null,
    setSearch: () => {},
    setSort: () => {},
    fetchMembers: () => {},
    fetchMoreMembers: () => {},
    slug: ''
  }

  constructor (props) {
    super(props)
    this.state = {
      isServerSearch: props.isServerSearch,
      members: props.members
    }
  }

  // TODO: Probably best to move fetching up to Members screen
  fetchMembers () {
    const { members, fetchMembers, hasMore } = this.props
    if (this.state.isServerSearch && isEmpty(members) && hasMore !== false) fetchMembers()
  }

  search (searchString) {
    if (this.state.isServerSearch) {
      this.props.setSearch(searchString)
    } else {
      const membersFilter = (m) => m.name.toLowerCase().includes(searchString.toLowerCase())
      this.setState({ members: filter(membersFilter, this.props.members) })
    }
  }

  componentDidMount () {
    this.props.isFocused && this.fetchMembers()
  }

  componentDidUpdate (prevProps) {
    if (!isEqual(get('members', this.props), get('members', prevProps))) {
      this.setState({
        members: this.props.members
      })
    }
    if (this.state.isServerSearch) {
      if (some(key => this.props[key] !== prevProps[key], [
        'isFocused',
        'slug',
        'sortBy',
        'search'
      ])) {
        return this.fetchMembers()
      }
    }
  }

  render () {
    const { members, isServerSearch } = this.state
    const {
      children, sortKeys, sortBy, setSort, fetchMoreMembers, pending, hideSortOptions, scrollRef, search
    } = this.props
    const onSearch = debounce(300, text => this.search(text))
    const actions = isServerSearch
      ? values(sortKeys).map((value, index) => [value, () => setSort(keys(sortKeys)[index])])
      : []
    // sort of a hack since members need to be even since it's rows of 2.  fixes flexbox
    const membersForFlatList = (size(members) % 2 > 0)
      ? members.concat([{ id: -1 }])
      : members

    const header = (
      <View>
        {children || null}
        <View style={styles.listControls}>
          <SearchBar
            placeholder='Search Members'
            onChangeText={onSearch}
            style={styles.searchWrapper} />
          {!hideSortOptions && (
            <PopupMenuButton actions={actions} style={styles.sortBy}>
              <Text style={styles.sortByText}>{sortKeys && sortKeys[sortBy]}</Text>
              <Icon name='ArrowDown' style={styles.downArrow} />
            </PopupMenuButton>
          )}
        </View>
      </View>
    )

    return (
      <FlatList
        ref={scrollRef}
        data={membersForFlatList}
        numColumns='2'
        renderItem={({ item }) => {
          if (item.name) {
            return <Member member={item} showMember={this.props.showMember} />
          } else {
            return <View style={styles.cell} />
          }
        }}
        onEndReached={isServerSearch && fetchMoreMembers}
        keyExtractor={(item, index) => item.id}
        ListHeaderComponent={header}
        ListFooterComponent={pending ? <Loading style={{ paddingTop: 10 }} /> : null}
      />
    )
  }
}

export default function(props) {
  const ref = React.useRef(null)

  useScrollToTop(ref)

  return <MemberList {...props} scrollRef={ref} />
}

export function Member ({ member, showMember }) {
  return (
    <TouchableOpacity
      onPress={() => isFunction(showMember) && showMember(member.id)}
      style={[styles.cell, styles.memberCell]}
    >
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
  )
}
