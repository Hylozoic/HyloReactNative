import React from 'react'
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  View
} from 'react-native'
import Avatar from '../Avatar'
import Icon from '../Icon'
import styles from './NewMessage.styles'

export default class NewMessage extends React.Component {
  render () {
    const {
      recentContacts,
      allContacts,
      currentUser,
      selectedContacts,
      removeContact,
      setContactInput,
      contactInputText
     } = this.props

    return <View style={styles.container}>
      <ContactInput
        contacts={selectedContacts}
        removeContact={removeContact}
        onChangeText={setContactInput}
        text={contactInputText} />
      <ContactList
        label='Recent'
        contacts={recentContacts} />
      <ContactList
        label='All Contacts'
        contacts={allContacts}
        grayed />
      <MessagePrompt currentUser={currentUser} />
    </View>
  }
}

export function ContactInput ({ contacts, onChangeText, removeContact }) {
  const { width } = Dimensions.get('window')
  const inputStyle = {width: width - 30}
  return <ScrollView contentContainerStyle={styles.scrollViewContainer} horizontal>
    {contacts.map(c => <ContactCard contact={c} key={c.id} remove={removeContact} />)}
    <TextInput onChangeText={onChangeText} style={[styles.contactTextInput, inputStyle]} />
  </ScrollView>
}

export function ContactCard ({ contact, remove }) {
  return <View style={styles.contactCard}>
    <Avatar avatarUrl={contact.avatarUrl} style={styles.contactCardAvatar} dimension={24} />
    <Text style={styles.contactName}>{contact.name}</Text>
    <TouchableOpacity onPress={() => remove(contact.id)}>
      <Icon name='Ex' style={styles.closeIcon} />
    </TouchableOpacity>
  </View>
}

export function ContactList ({ contacts, label, grayed }) {
  return <View style={styles.contactList}>
    <Text style={styles.listLabel}>{label}</Text>
    {contacts.map(c => <ContactRow contact={c} grayed={grayed} key={c.id} />)}
  </View>
}

export function ContactRow ({ contact, grayed }) {
  return <View style={[styles.contactRow, grayed && styles.grayed]}>
    <Avatar avatarUrl={contact.avatarUrl} style={styles.contactAvatar} dimension={30} />
    <Text style={styles.contactName}>{contact.name}</Text>
  </View>
}

export function MessagePrompt ({ currentUser }) {
  if (!currentUser) return null
  const { avatarUrl } = currentUser
  return <View style={styles.promptContainer}>
    <View style={styles.messagePrompt}>
      <TouchableOpacity style={styles.promptButton}>
        <Avatar avatarUrl={avatarUrl} style={styles.promptAvatar} dimension={30} />
        <Text style={styles.promptText}>Type your message here</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.promptShadow} />
  </View>
}
