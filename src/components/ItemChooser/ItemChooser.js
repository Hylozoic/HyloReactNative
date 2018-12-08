import React from 'react'
import PropTypes from 'prop-types'
import {
  SectionList,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity
} from 'react-native'
import { debounce } from 'lodash/fp'
import SearchBar from '../SearchBar'
import styles from './ItemChooser.styles'

export const propTypesForItemRowComponent = {
  item: PropTypes.object.isRequired,
  chosen: PropTypes.bool.isRequired,
  toggleChosen: PropTypes.func,
  chooseItem: PropTypes.func,
  unChooseItem: PropTypes.func,
  pickItem: PropTypes.func
}

export default class ItemChooser extends React.Component {
  static propTypes = {
    fetchSearchSuggestions: PropTypes.func.isRequired,
    getSearchSuggestions: PropTypes.func.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    pickItem: PropTypes.func,
    done: PropTypes.func,
    updateItems: PropTypes.func,
    initialItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.isRequired
      })
    ),
    defaultItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.isRequired
      })
    ),
    defaultItemsLabel: PropTypes.string,
    ItemRowComponent: PropTypes.func.isRequired,
    searchTerm: PropTypes.string,
    suggestedItems: PropTypes.array,
    loading: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    searchTerm: undefined,
    initialItems: [],
    suggestedItems: [],
    searchPlaceholder: 'Begin type to searching'
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
    this.clearSearchTerm()
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

  pickItem = (item) => this.props.pickItem(item)

  setupItemSections = (suggestedItems) => {
    const { searchTerm, defaultItems, defaultItemsLabel, updateItems } = this.props
    const { chosenItems, initialItems } = this.state
    const chosenItemIds = chosenItems.map(p => p.id)
    const initialItemIds = initialItems.map(item => item.id)
    const addSelected = items => items.map(item => ({
      ...item,
      chosen: chosenItemIds.includes(item.id)
    }))
    const sections = []
    const addedItems = chosenItems.filter(item => !initialItemIds.includes(item.id))
    // chooser
    if (updateItems) {
      if (searchTerm) return [{ data: addSelected(suggestedItems) }]
      if (initialItems.length > 0) {
        const label = addedItems.length > 0 ? 'Current Selection' : undefined
        sections.push({ label, data: addSelected(initialItems) })
      }
      if (addedItems.length > 0) {
        sections.push({ label: 'Added', data: addSelected(addedItems) })
      }
    // picker
    } else {
      if (searchTerm) {
        const filteredSuggestedItems = suggestedItems.filter(item => !initialItemIds.includes(item.id))
        return [{ data: filteredSuggestedItems }]
      }
      if (defaultItems && defaultItemsLabel) {
        const addedItemIds = addedItems.filter(item => item.id)
        const label = defaultItems.length > 0 ? defaultItemsLabel : undefined
        let filteredDefaultItems = defaultItems
          .filter(item => !initialItemIds.includes(item.id))
          .filter(item => !addedItemIds.includes(item.id))
        if (defaultItems.length > 0) {
          sections.push({ label, data: addSelected(filteredDefaultItems) })
        }
      }
    }
    return sections
  }

  setSearchTerm = (searchTerm) => {
    this.props.setSearchTerm(searchTerm)
    this.fetchSearchSuggestions(searchTerm)
  }

  fetchSearchSuggestions = debounce(400, (searchTerm) =>
    this.props.fetchSearchSuggestions(searchTerm))

  clearSearchTerm = () => this.props.setSearchTerm()

  renderItemRowComponent = ({ item }) => {
    const { ItemRowComponent } = this.props
    const toggleChosen = item.chosen ? this.removeItem : this.addItem
    const chooseItem = () => this.addItem(item)
    const unChooseItem = () => this.removeItem(item)
    const pickItem = () => this.pickItem(item)

    return <ItemRowComponent
      item={item}
      chosen={item.chosen}
      chooseItem={chooseItem}
      toggleChosen={toggleChosen}
      unChooseItem={unChooseItem}
      onPress={pickItem} />
  }

  render () {
    const { searchTerm, style } = this.props
    const headerText = searchTerm ? `Matching "${searchTerm}"` : undefined
    const sections = this.setupItemSections(this.props.suggestedItems)

    return <SafeAreaView style={style}>
      <ItemChooserListHeader
        {...this.props}
        headerText={headerText}
        setSearchTerm={this.setSearchTerm}
        clearSearchTerm={this.clearSearchTerm} />
      <SectionList
        sections={sections}
        renderSectionHeader={SectionHeader}
        renderItem={this.renderItemRowComponent}
        // ListFooterComponent={<ItemChooserListFooter {...this.props} />}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
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
  setSearchTerm,
  clearSearchTerm,
  searchPlaceholder,
  loading
}) {
  return <View style={styles.listHeader}>
    <SearchBar
      autoFocus
      value={searchTerm}
      onChangeText={setSearchTerm}
      placeholder={searchPlaceholder}
      // onCancel={clearSearchTerm}
      // onCancelText='Clear'
      loading={loading}
    />
    {searchTerm && <View style={styles.listHeaderStatus}>
      <Text style={styles.listHeaderText}>
        <Text>{headerText}</Text>
      </Text>
      <TouchableOpacity onPress={clearSearchTerm}>
        <Text style={styles.listHeaderClear}>Clear Search</Text>
      </TouchableOpacity>
    </View>}
  </View>
}
