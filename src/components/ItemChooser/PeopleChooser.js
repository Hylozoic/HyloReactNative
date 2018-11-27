// import React from 'react'
// import PropTypes from 'prop-types'
// import { compact } from 'lodash/fp'
// import {
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native'
// import Icon from '../Icon'
// import RoundCheckbox from 'rn-round-checkbox'
// import Loading from '../Loading'
// import ItemChooser from './ItemChooser'

// import styles from './PeopleChooser.styles'

// export default class PeopleChooser extends React.Component {
//   static propTypes = {
//     chosenItems: PropTypes.array,
//     searchText: PropTypes.string,
//     suggestions: PropTypes.array,
//     // fetchSuggestions: PropTypes.func.isRequired,
//     updateItems: PropTypes.func.isRequired,
//     // loadingSuggestions: PropTypes.bool,
//     // fetchRecentContacts: PropTypes.func,
//     // loadingRecentContacts: PropTypes.bool,
//     placeholderText: PropTypes.string,
//     defaultItemSuggestions: PropTypes.array
//   }

//   static defaultProps = {
//     chosenItems: []
//   }

//   state = {
//     chosenItems: [],
//     searchText: ''
//   }

//   componentDidMount () {
//     // this.props.fetchRecentContacts()
//     this.setState({
//       chosenItems: this.props.chosenItems
//     })
//   }

//   updateSearchText = searchText => {
//     this.props.fetchSuggestions(searchText)
//     this.setState({ searchText })
//   }

//   addItem = item => {
//     const { chosenItems } = this.state
//     const updatedItems = chosenItems.concat(item)
//     this.setState({
//       chosenItems: chosenItems.concat(item)
//     })
//     this.updateItems(updatedItems)
//     this.updateSearchText('')
//   }

//   removeItem = item => {
//     const { chosenItems } = this.state
//     const updatedItems = chosenItems.filter(p => p.id !== item.id)
//     this.setState({
//       chosenItems: updatedItems
//     })
//     this.updateItems(updatedItems)
//   }

//   updateItems = chosenItems => {
//     this.props.updateItems(chosenItems)
//   }

//   filterChosenItemsById = suggestions => {
//     const { chosenItems } = this.state
//     const chosenItemIds = chosenItems.map(p => p.id)
//     return compact(suggestions).filter(p => !chosenItemIds.includes(p.id))
//   }

//   render () {
//     const {
//       suggestions,
//       defaultItemSuggestions,
//       placeholderText
//     } = this.props
//     const {
//       searchText,
//       chosenItems
//     } = this.state
//     const itemSuggestions = this.filterChosenItemsById(suggestions)

//     return <ItemChooser
//       placeholder={placeholderText}
//       searchText={searchText}
//       updateSearchText={this.updateSearchText}
//       suggestedItems={itemSuggestions || defaultItemSuggestions}
//       addItem={this.addItem}
//       removeitem={this.removeItem}
//       chosenItems={chosenItems}
//       RowComponent={ContactRow}
//     />
//   }
// }

// Props for RoundCheckbox:
// onValueChange: PropTypes.func,
// icon: PropTypes.string,
// size: PropTypes.number,
// backgroundColor: PropTypes.string,
// iconColor: PropTypes.string,
// borderColor: PropTypes.string,
// checked: PropTypes.bool

// export function Person ({ person, remove }) {
//   return <View style={styles.person}>
//     <Avatar avatarUrl={person.avatarUrl} style={styles.personAvatar} dimension={24} />
//     <Text style={styles.contactName}>{person.name}</Text>
//     <TouchableOpacity onPress={() => remove(person)}>
//       <Icon name='Ex' style={styles.closeIcon} />
//     </TouchableOpacity>
//   </View>
// }

// export function SectionHeader ({ section }) {
//   const { label, loading } = section
//   return <View style={styles.sectionHeader}>
//     {label && <Text style={styles.listLabel}>{label}</Text>}
//     {loading && <Loading />}
//   </View>
// }
