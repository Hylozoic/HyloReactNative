import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import Avatar from '../Avatar'
import styles from './NewMessage.styles'

export default class NewMessage extends React.Component {
  render () {
    const { recentContacts, allContacts, currentUser } = this.props

    return <View style={styles.container}>
      <MessageRecipients />
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

export function MessageRecipients () {
  return <View style={styles.messageRecipients} />
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
