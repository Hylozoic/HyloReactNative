import React from 'react'
import PropTypes from 'prop-types'
import {
  SectionList,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from 'react-native'
import { debounce } from 'lodash/fp'
import SearchBar from '../SearchBar'
import Loading from '../Loading'
import styles from './ItemChooser.styles'

export default class ItemChooser extends React.Component {
  static propTypes = {
    // Required for connector
    fetchSearchSuggestions: PropTypes.func.isRequired,
    getSearchSuggestions: PropTypes.func.isRequired,
    // Used in component
    updateItems: PropTypes.func.isRequired,
    setSearchText: PropTypes.func.isRequired,
    ItemRowComponent: PropTypes.func.isRequired,
    initialItems: PropTypes.array,
    searchTerm: PropTypes.oneOfType([
      PropTypes.undefined,
      PropTypes.string
    ]),
    suggestedItems: PropTypes.array,
    loading: PropTypes.bool,
    searchPlaceholder: PropTypes.string
  }

  static defaultProps = {
    searchTerm: undefined,
    initialItems: [],
    suggestedItems: [],
    searchPlaceholder: 'Type to begin searching'
  }

  state = {
    chosenItems: []
  }

  constructor (props) {
    super(props)

    this.state = {
      chosenItems: this.props.initialItems,
      initialItems: this.props.initialItems
    }
  }

  componentWillUnmount () {
    this.clearSearch()
  }

  addItem = (item) => {
    const updatedItems = this.state.chosenItems.concat(item)
    this.updateItems(updatedItems)
  }

  removeItem = (item) => {
    const updatedItems = this.state.chosenItems.filter(p => p.id !== item.id)
    this.updateItems(updatedItems)
  }

  updateItems (updatedItems) {
    this.setState(state => ({ chosenItems: updatedItems }))
    this.props.updateItems(updatedItems)
  }

  setupItemSections = (suggestedItems) => {
    const { chosenItems, initialItems } = this.state
    const chosenItemIds = chosenItems.map(p => p.id)
    const addSelected = items => items.map(item => ({
      ...item,
      selected: chosenItemIds.includes(item.id)
    }))
    if (this.props.searchTerm) return [{ data: addSelected(suggestedItems) }]
    const sections = []
    const initialItemIds = initialItems.map(p => p.id)
    const addedItems = chosenItems.filter(item => !initialItemIds.includes(item.id))
    if (initialItems.length > 0) {
      const label = addedItems.length > 0 ? 'Original' : undefined
      sections.push({ label, data: addSelected(initialItems) })
    }
    if (addedItems.length > 0) {
      sections.push({ label: 'Added', data: addSelected(addedItems) })
    }
    return sections
  }

  setSearchAndFetchSuggestions = (searchTerm) => {
    this.props.setSearchText(searchTerm)
    this.fetchSearchSuggestions(searchTerm)
  }

  fetchSearchSuggestions = debounce(400, (searchTerm) =>
    this.props.fetchSearchSuggestions(searchTerm))

  clearSearch = () => this.props.setSearchText()

  // Rendering

  renderListHeader = () => {
    const { searchTerm } = this.props
    const headerText = searchTerm ? `Matching "${searchTerm}"` : undefined

    return <ItemChooserListHeader
      {...this.props}
      headerText={headerText}
      setSearchAndFetchSuggestions={this.setSearchAndFetchSuggestions}
      clearSearch={this.clearSearch} />
  }

  renderListRowItem = ({ item }) => {
    const { ItemRowComponent } = this.props
    const onCheck = item.selected ? this.removeItem : this.addItem
    return <ItemRowComponent
      item={item}
      selected={item.selected}
      onCheck={onCheck} />
  }

  render () {
    const { searchTerm } = this.props
    const headerText = searchTerm ? `Matching "${searchTerm}"` : undefined
    const sections = this.setupItemSections(this.props.suggestedItems)

    return <SafeAreaView>
      <ItemChooserListHeader
        {...this.props}
        headerText={headerText}
        setSearchAndFetchSuggestions={this.setSearchAndFetchSuggestions}
        clearSearch={this.clearSearch} />
      <SectionList
        sections={sections}
        renderSectionHeader={SectionHeader}
        renderItem={this.renderListRowItem}
        // ListFooterComponent={<ItemChooserListFooter {...this.props} />}
        stickySectionHeadersEnabled={false}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps='handled' />
    </SafeAreaView>
  }
}

export function SectionHeader ({ section: { label } }) {
  if (!label) return null
  return <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{label.toUpperCase()}</Text>
  </View>
}

export function ItemChooserListHeader ({
  searchTerm,
  headerText,
  setSearchAndFetchSuggestions,
  clearSearch,
  searchPlaceholder,
  loading
}) {
  return <View style={styles.listHeader}>
    <SearchBar
      value={searchTerm}
      onChangeText={setSearchAndFetchSuggestions}
      placeholder={searchPlaceholder}
      // onCancel={clearSearch}
      // onCancelText='Clear'
      loading={loading}
    />
    {searchTerm && <View style={styles.listHeaderStatus}>
      <Text style={styles.listHeaderText}>
        <Text>{headerText}</Text>
      </Text>
      <TouchableOpacity onPress={clearSearch}>
        <Text style={styles.listHeaderClear}>Clear Search</Text>
      </TouchableOpacity>
    </View>}
  </View>
}

// export function ItemChooserListFooter ({ loading }) {
//   return loading
//     ? <Loading style={styles.loading} />
//     : null
// }
// for flatlist:
// } else {
//   const items = uniqBy('id', [...initialItems, ...chosenItems])
//   return addSelected(items)
// }
