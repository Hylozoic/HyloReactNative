import React from 'react'
import PropTypes from 'prop-types'
import {
  FlatList,
  Text,
  View,
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
    chosenItems: PropTypes.array,
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
    chosenItems: [],
    suggestedItems: [],
    searchPlaceholder: 'Type here to begin searching'
  }

  state = {
    chosenItems: []
  }

  constructor (props) {
    super(props)

    this.state = {
      chosenItems: this.props.chosenItems
    }
  }

  componentWillUnmount () {
    this.clearSearch()
  }

  addItem = item => {
    const { chosenItems } = this.state
    const updatedItems = chosenItems.concat(item)
    this.setState({
      chosenItems: chosenItems.concat(item)
    })
    this.props.updateItems(updatedItems)
  }

  removeItem = item => {
    const { chosenItems } = this.state
    const updatedItems = chosenItems.filter(p => p.id !== item.id)
    this.setState({
      chosenItems: updatedItems
    })
    this.props.updateItems(updatedItems)
  }

  setupItems = suggestedItems => {
    const { chosenItems } = this.state
    const { searchTerm } = this.props
    const items = searchTerm ? suggestedItems : chosenItems
    const chosenItemIds = chosenItems.map(p => p.id)

    return items.map(item => ({
      ...item,
      selected: chosenItemIds.includes(item.id)
    }))
  }

  setSearchAndFetchSuggestions = searchTerm => {
    this.props.setSearchText(searchTerm)
    this.fetchSearchSuggestions(searchTerm)
  }

  fetchSearchSuggestions = debounce(400, searchTerm =>
    this.props.fetchSearchSuggestions(searchTerm))

  clearSearch = () => this.props.setSearchText()

  // item list rendering
  renderListHeader = () => {
    const { searchTerm } = this.props
    const normalHeaderText = 'Current Project Members'
    const searchingHeaderText = `People matching "${searchTerm}"`
    const headerText = searchTerm ? searchingHeaderText : normalHeaderText

    return <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>
        <Text>{headerText}</Text>
      </Text>
      {searchTerm && <TouchableOpacity onPress={this.clearSearch}>
        <Text style={styles.listHeaderClear}>Clear Search</Text>
      </TouchableOpacity>}
    </View>
  }

  renderListRowItem = ({ item }) => {
    const { ItemRowComponent } = this.props
    return <ItemRowComponent
      item={item}
      selected={item.selected}
      onCheck={item.selected ? this.removeItem : this.addItem} />
  }

  renderListFooter = () => this.props.loading
    ? <Loading style={styles.loading} />
    : null

  render () {
    const { searchTerm, searchPlaceholder } = this.props
    const items = this.setupItems(this.props.suggestedItems)

    return <SafeAreaView>
      <SearchBar
        value={searchTerm}
        onChangeText={this.setSearchAndFetchSuggestions}
        placeholder={searchPlaceholder} />
      <FlatList
        data={items}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={this.renderListHeader}
        renderItem={this.renderListRowItem}
        ListFooterComponent={this.renderListFooter}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps='handled' />
    </SafeAreaView>
  }
}

// contentContainerStyle={styles.sectionList}
// onEndReachedThreshold={0.3}
// stickySectionHeadersEnabled={false}

// return compact(suggestedItems).filter(p => !chosenItemIds.includes(p.id))
// const suggestedItems = this.filterChosenItemsById(this.props.suggestedItems)

// filterChosenItemsById = suggestedItems => {
//   const { chosenItems } = this.state
//   const chosenItemIds = chosenItems.map(p => p.id)
//   // return compact(suggestedItems).filter(p => !chosenItemIds.includes(p.id))
//   return compact(suggestedItems).map(item => ({
//     ...item,
//     selected: chosenItemIds.includes(item.id)
//   }))
// }

/* <Text>Chosen Items Below</Text>
{suggestedItems.length < 1 && <FlatList
  data={chosenItems}
  renderItem={item =>
    <ItemRowComponent
      person={item.item}
      selected
      onCheck={this.removeItem}
      style={styles.contactRow} />}
  contentContainerStyle={styles.sectionList}
  onEndReachedThreshold={0.3}
  stickySectionHeadersEnabled={false}
  keyExtractor={item => item.id} />} */
// <View>
// <SearchBar term={searchTerm} setTerm={this.updateSearchText} placeholder={placeholderText} />
// <FlatList
//  data={peopleSuggestions}
//  renderItem={item =>
//    <ContactRow
//      contact={item.item}
//       selected={item.selected}
//       onPress={this.addPerson}
//       style={styles.contactRow} />}
//   onEndReachedThreshold={0.3}
//   stickySectionHeadersEnabled={false} />
// <Text>test</Text>
// <FlatList
//   data={chosenPeople}
//   renderItem={item =>
//     <ContactRow
//       contact={item.item}
//       selected={item.selected}
//       onPress={this.removePerson}
//       style={styles.contactRow} />}
//   contentContainerStyle={styles.sectionList}
//  keyExtractor={item => item.id} />
// </View>