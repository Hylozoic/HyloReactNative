import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { didPropsChange } from 'util/index'
import styles from './FeedList.styles'
import PostRow from './PostRow'
import Loading from '../Loading'
import Icon from '../Icon'
import PopupMenuButton from '../PopupMenuButton'
import { find, get, isEmpty, includes } from 'lodash/fp'
export default class FeedList extends React.Component {
  fetchOrShowCached () {
    console.log('fetchOrShowCached')
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
    console.log('FEEDLIST - componentDidUpdate')
    const isAFeedTab = props => {
      return includes(['Home', 'Projects'], props.screenProps.currentTabName)
    }

    console.log('1')

    if (!isAFeedTab(this.props)) {
      console.log('not a feed tab')
      return
    }
    console.log('but kept going')
    if (!prevProps || isAFeedTab(prevProps)) {
      return this.fetchOrShowCached()
    }
    if (!prevProps.isFocused && this.props.isFocused) {
      return this.fetchOrShowCached()
    }

    const hasChanged = this.hasChangedFeed(prevProps)
    console.log('hasChanged', hasChanged)
    if (hasChanged) {
      return this.fetchOrShowCached()
    }
  }

  hasChangedFeed (prevProps) {
    console.log('hasChangedFeed props', this.props)
    console.log('hasChangedFeed prevProps', prevProps)    
    if (prevProps.sortBy !== this.props.sortBy) return true
    if (prevProps.filter !== this.props.filter) return true
    if (get('id', prevProps.community) !== get('id', this.props.community)) return true
    if (get('id', prevProps.network) !== get('id', this.props.network)) return true
    if (get('screenProps.currentTabName', prevProps) !== get('screenProps.currentTabName', this.props)) return true
    return false
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
    shouldShowCommunities={this.props.all}
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
