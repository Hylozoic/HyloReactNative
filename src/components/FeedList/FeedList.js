import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { didPropsChange } from 'util/index'
import styles from './FeedList.styles'
import PostRow from './PostRow'
import Loading from '../Loading'
import Icon from '../Icon'
import PopupMenuButton from '../PopupMenuButton'
import { find, get, isEmpty } from 'lodash/fp'
export default class FeedList extends React.Component {
  fetchOrShowCached () {
    const { hasMore, postIds, fetchPosts, pending } = this.props
    if (fetchPosts && isEmpty(postIds) && hasMore !== false && !pending) {
      fetchPosts()
    }
  }

  componentDidMount () {
    this.fetchOrShowCached()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused && didPropsChange(this.props, nextProps)
  }

  componentDidUpdate (prevProps) {
    // The first two checks below prevent data from being loaded until the Home
    // tab is actually visible.
    //
    // This implementation causes a pretty strong coupling between FeedList and
    // the Home tab, both by hard-coding the tab name and by using screenProps,
    // which we had to pass down from the Home component through Feed. This will
    // have to be reworked to allow opening topic feeds in the Topic tab, e.g.
    if (this.props.screenProps.currentTabName !== 'Home') {
      return
    }
    if (!prevProps || prevProps.screenProps.currentTabName !== 'Home') {
      return this.fetchOrShowCached()
    }
    if (prevProps.sortBy !== this.props.sortBy ||
        prevProps.filter !== this.props.filter ||
        get('id', prevProps.community) !== get('id', this.props.community) ||
        get('id', prevProps.network) !== get('id', this.props.network)) {
      this.fetchOrShowCached()
    }
  }

  refreshPosts = (...args) => this.props.refreshPosts(...args)
  fetchMorePosts = (...args) => this.props.fetchMorePosts(...args)

  showPost = (...args) => this.props.showPost(...args)
  showMember = (...args) => this.props.showMember(...args)
  showTopic = (...args) => this.props.showTopic(...args)
  goToCommunity = (...args) => this.props.goToCommunity(...args)

  setFilter = (...args) => this.props.setFilter(...args)
  setSort = (...args) => this.props.setSort(...args)

  renderItem = ({ item }) => <PostRow
    postId={item}
    communityId={this.props.communityId}
    showPost={this.showPost}
    showMember={this.showMember}
    showTopic={this.showTopic}
    goToCommunity={this.goToCommunity} />

  keyExtractor = (item) => `post${item}`

  render () {
    const {
      postIds,
      pendingRefresh
    } = this.props

    return <View style={styles.container}>
      <FlatList
        data={postIds}
        renderItem={this.renderItem}
        onRefresh={this.refreshPosts}
        refreshing={!!pendingRefresh}
        keyExtractor={this.keyExtractor}
        onEndReached={this.fetchMorePosts}
        ListHeaderComponent={<View>
          {this.props.header}
          <ListControls
            filter={this.props.filter}
            sortBy={this.props.sortBy}
            setFilter={this.setFilter}
            setSort={this.setSort}
            pending={this.props.pending}
          />
        </View>}
        ListFooterComponent={this.props.pending
          ? <Loading style={styles.loading} />
          : null} />
    </View>
  }
}

export const filterOptions = [
  {id: null, label: 'All Posts'},
  {id: 'discussion', label: 'Discussions'},
  {id: 'request', label: 'Requests'},
  {id: 'offer', label: 'Offers'}
]

const sortOptions = [
  {id: 'updated', label: 'Latest'},
  {id: 'votes', label: 'Popular'}
]

const optionText = (id, options) => {
  const option = find(o => o.id === id, options) || options[0]
  return option.label
}

export function ListControls ({ filter: listFilter, sortBy, setFilter, setSort }) {
  return <View style={styles.listControls}>
    <ListControl selected={listFilter} onChange={setFilter} options={filterOptions} />
    <ListControl selected={sortBy} onChange={setSort} options={sortOptions} />
  </View>
}

export function ListControl ({ selected, options, onChange }) {
  const actions = options.map(option => [
    option.label,
    () => onChange(option.id)
  ])

  return <PopupMenuButton
    actions={actions}
    style={styles.listControl}>
    <Text style={styles.optionText}>{optionText(selected, options)}</Text>
    <Icon name='ArrowDown' style={[styles.optionText, styles.downArrow]} />
  </PopupMenuButton>
}
