import React from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  SectionList,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  View
} from 'react-native'
import { caribbeanGreen } from 'style/colors'
import SearchBar from '../SearchBar'
import Avatar from '../Avatar'
import Icon from '../Icon'
import RoundCheckbox from 'rn-round-checkbox'
import Loading from '../Loading'
import styles from './PeopleChooser.styles'
import { isEmpty, compact } from 'lodash/fp'
import { isIOS } from 'util/platform'

export default class PeopleChooser extends React.Component {
  static propTypes = {
    people: PropTypes.array,
    setPersonInput: PropTypes.func.isRequired,
    personInputText: PropTypes.string,
    suggestions: PropTypes.array,
    fetchSuggestions: PropTypes.func.isRequired,
    loadingSuggestions: PropTypes.bool,
    fetchRecentContacts: PropTypes.func,
    loadingRecentContacts: PropTypes.bool,
    placeholderText: PropTypes.string,
    recentContacts: PropTypes.array,
    showRecentContacts: PropTypes.bool,
    horizontal: PropTypes.bool
  }

  static defaultProps = {
    people: []
  }

  state = {
    people: []
  }

  componentDidMount () {
    this.props.fetchRecentContacts()
    this.setState({
      people: this.props.people
    })
  }

  componentDidUpdate (prevProps) {
    const { personInputText, fetchSuggestions } = this.props
    if (prevProps.personInputText !== personInputText) {
      fetchSuggestions()
    }
  }

  addPerson = person => {
    const { people } = this.state
    const updatedPeople = people.concat(person)
    this.setState({
      people: people.concat(person)
    })
    this.updatePeople(updatedPeople)
    this.props.setPersonInput('')
  }

  removePerson = person => {
    const { people } = this.state
    const updatedPeople = people.filter(p => p.id !== person.id)
    this.setState({
      people: updatedPeople
    })
    this.updatePeople(updatedPeople)
  }

  updatePeople = people => {
    this.props.updatePeople(people)
  }

  filterChosenPeople = list => {
    const { people } = this.state
    const peopleIds = people.map(p => p.id)
    return compact(list).filter(p => !peopleIds.includes(p.id))
  }

  render () {
    const {
      recentContacts,
      suggestions,
      loadingSuggestions,
      loadingRecentContacts,
      setPersonInput,
      personInputText,
      showRecentContacts,
      placeholderText
    } = this.props

    const { people } = this.state

    const showSuggestions = !isEmpty(personInputText)

    var listSections = []
    if (showSuggestions) {
      listSections = [
        {data: this.filterChosenPeople(suggestions), loading: loadingSuggestions}
      ]
    } else if (showRecentContacts) {
      listSections = [
        {data: this.filterChosenPeople(recentContacts), label: 'Recent', loading: loadingRecentContacts}
      ]
    }

    console.log('!!!!', people)
    // removePerson={this.removePerson}

    return <View>
      <SearchBar term={personInputText} setTerm={setPersonInput} placeholder={placeholderText} />
      <SectionList
        sections={listSections}
        renderItem={item =>
          <ContactRow contact={item} onCheck={this.addPerson} style={styles.contactRow} />}        
        contentContainerStyle={styles.sectionList}
        renderSectionHeader={SectionHeader}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0.3}
        stickySectionHeadersEnabled={false} />
      <FlatList
        data={people}
        renderItem={item =>
          <ContactRow contact={item.item} onCheck={this.addPerson} style={styles.contactRow} />}
        contentContainerStyle={styles.sectionList}
        keyExtractor={item => item.id} />
    </View>
  }
}

export function PersonInput ({
  people,
  onChangeText,
  removePerson,
  text,
  placeholderText = 'Type in the names of people to message' }) {
  return <View style={styles.scrollViewWrapper}>
    <ScrollView
      contentContainerStyle={styles.personInputContainer}
      horizontal>
      {people.map(p => <Person person={p} key={p.id} remove={removePerson} />)}
      <TextInput
        value={text}
        onChangeText={onChangeText}
        underlineColorAndroid='transparent'
        placeholder={placeholderText}
        style={isIOS ? null : styles.personTextInput} />
    </ScrollView>
  </View>
}

export function ContactRow ({
  contact,
  grayed,
  onCheck = undefined,
  onPress = undefined
}) {
  return <TouchableOpacity onPress={onPress}>
    <View style={[styles.contactRow, grayed && styles.grayed]}>
      <Avatar avatarUrl={contact.avatarUrl} style={styles.contactAvatar} dimension={30} />
      <Text style={styles.contactName}>{contact.name}</Text>
      {onCheck &&
        <RoundCheckbox checked backgroundColor={caribbeanGreen} onValueChange={() => onCheck(contact)} />}
    </View>
  </TouchableOpacity>
}
// Props for RoundCheckbox:
//
// onValueChange: PropTypes.func,
// icon: PropTypes.string,
// size: PropTypes.number,
// backgroundColor: PropTypes.string,
// iconColor: PropTypes.string,
// borderColor: PropTypes.string,
// checked: PropTypes.bool
//

export function Person ({ person, remove }) {
  return <View style={styles.person}>
    <Avatar avatarUrl={person.avatarUrl} style={styles.personAvatar} dimension={24} />
    <Text style={styles.contactName}>{person.name}</Text>
    <TouchableOpacity onPress={() => remove(person)}>
      <Icon name='Ex' style={styles.closeIcon} />
    </TouchableOpacity>
  </View>
}

export function SectionHeader ({ section }) {
  const { label, loading } = section
  return <View style={styles.sectionHeader}>
    {label && <Text style={styles.listLabel}>{label}</Text>}
    {loading && <Loading />}
  </View>
}
