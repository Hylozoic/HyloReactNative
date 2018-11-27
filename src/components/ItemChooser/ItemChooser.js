import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash/fp'
import {
  FlatList,
  Text,
  View
} from 'react-native'
import SearchBar from '../SearchBar'
import Loading from '../Loading'
import styles from './ItemChooser.styles'

export default class ItemChooser extends React.Component {
  static propTypes = {
    chosenItems: PropTypes.array,
    searchText: PropTypes.string,
    suggestedItems: PropTypes.array,
    loading: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    updateItems: PropTypes.func.isRequired,
    fetchSearchSuggestions: PropTypes.func.isRequired,
    // Required for connector
    getSearchSuggestions: PropTypes.func.isRequired,
    setSearchText: PropTypes.func.isRequired,
    queryScope: PropTypes.string,
    ItemRowComponent: PropTypes.func.isRequired
  }

  static defaultProps = {
    searchText: undefined,
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

  updateSearchText = searchText => {
    this.props.setSearchText(searchText)
    this.props.fetchSearchSuggestions(searchText)
  }

  addItem = item => {
    const { chosenItems } = this.state
    const updatedItems = chosenItems.concat(item)
    this.setState({
      chosenItems: chosenItems.concat(item)
    })
    this.updateItems(updatedItems)
  }

  removeItem = item => {
    const { chosenItems } = this.state
    const updatedItems = chosenItems.filter(p => p.id !== item.id)
    this.setState({
      chosenItems: updatedItems
    })
    this.updateItems(updatedItems)
  }

  updateItems = chosenItems => {
    this.props.updateItems(chosenItems)
  }

  setupItems = suggestedItems => {
    const { chosenItems } = this.state
    const { searchText } = this.props
    const items = searchText ? suggestedItems : chosenItems
    const chosenItemIds = chosenItems.map(p => p.id)

    return items.map(item => ({
      ...item,
      selected: chosenItemIds.includes(item.id)
    }))
  }

  clearSearch = () => this.props.setSearchText()

  // rendering

  renderHeader = () => {
    const { loading, searchText, searchPlaceholder } = this.props
    // value={searchText}
    // onChangeText={this.updateSearchText}
    // placeholder={searchPlaceholder}
    // onCancel={this.clearSearch} 
    return searchText
      ? <Text>Search Results</Text>
      : <Text>All Project Members</Text>
  }

  renderRowItem = ({ item }) => <this.props.ItemRowComponent
    item={item}
    selected={item.selected}
    onCheck={item.selected ? this.removeItem : this.addItem} />

  renderFooter = () => this.props.loading
    ? <Loading style={styles.loading} />
    : null

  render () {
    const { searchText, searchPlaceholder } = this.props
    const items = this.setupItems(this.props.suggestedItems)

    return <View>
      <SearchBar
        value={searchText}
        onChangeText={this.updateSearchText}
        placeholder={searchPlaceholder}
        onCancel={this.clearSearch} />
      <FlatList
        data={items}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderRowItem}
        ListFooterComponent={this.renderFooter}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps='handled' />
    </View>
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
// <SearchBar term={searchText} setTerm={this.updateSearchText} placeholder={placeholderText} />
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