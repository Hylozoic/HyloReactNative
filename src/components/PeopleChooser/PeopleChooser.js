import React from 'react'
import {
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  TextInput,
  View
} from 'react-native'
import Avatar from '../Avatar'
import Icon from '../Icon'
import Loading from '../Loading'
import styles from './PeopleChooser.styles'
import { isEmpty, compact } from 'lodash/fp'
import { isIOS } from 'util/platform'

export default class PeopleChooser extends React.Component {
  state = {
    people: []
  }

  componentDidMount () {
    this.props.fetchRecentContacts()
    this.setState({
      people: this.props.peopleFromParams || []
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
      setPersonInput,
      personInputText,
      pending,
      showRecentContacts,
      placeholderText
    } = this.props

    const { people } = this.state

    const showSuggestions = !isEmpty(personInputText)

    var listSections = []
    if (showSuggestions) {
      listSections = [
        {data: this.filterChosenPeople(suggestions), loading: pending.suggestions}
      ]
    } else if (showRecentContacts) {
      listSections = [
        {data: this.filterChosenPeople(recentContacts), label: 'Recent', loading: pending.recent}
      ]
    }

    return <View>
      <PersonInput
        people={people}
        removePerson={this.removePerson}
        onChangeText={setPersonInput}
        text={personInputText}
        placeholderText={placeholderText} />
      <SectionList
        contentContainerStyle={styles.sectionList}
        renderItem={renderContact(this.addPerson)}
        renderSectionHeader={SectionHeader}
        keyExtractor={item => item.id}
        sections={listSections}
        onEndReachedThreshold={0.3}
        stickySectionHeadersEnabled={false} />
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

// This component is also used by PostEditor
export function Person ({ person, remove }) {
  return <View style={styles.person}>
    <Avatar avatarUrl={person.avatarUrl} style={styles.personAvatar} dimension={24} />
    <Text style={styles.contactName}>{person.name}</Text>
    <TouchableOpacity onPress={() => remove(person)}>
      <Icon name='Ex' style={styles.closeIcon} />
    </TouchableOpacity>
  </View>
}

export function renderContact (addPerson) {
  return ({ item }) => <ContactRow style={styles.contactRow} contact={item} add={addPerson} />
}

export function SectionHeader ({ section }) {
  const { label, loading } = section
  return <View style={styles.sectionHeader}>
    {label && <Text style={styles.listLabel}>{label}</Text>}
    {loading && <Loading />}
  </View>
}

export function ContactRow ({ contact, grayed, add }) {
  return <TouchableOpacity onPress={() => add(contact)}>
    <View style={[styles.contactRow, grayed && styles.grayed]}>
      <Avatar avatarUrl={contact.avatarUrl} style={styles.contactAvatar} dimension={30} />
      <Text style={styles.contactName}>{contact.name}</Text>
    </View>
  </TouchableOpacity>
}
