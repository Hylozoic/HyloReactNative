import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import Avatar from '../Avatar'
import styles from './NewMessage.styles'

export default class NewMessage extends React.Component {
  render () {
    const { recentContacts, allContacts } = this.props

    return <View style={styles.container}>
      <MessageRecipients />
      <ContactList
        label='Recent'
        contacts={recentContacts} />
      <ContactList
        label='All Contacts'
        contacts={allContacts}
        grayed />
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

export function MessagePrompt ({ currentUser, newPost }) {
  if (!currentUser) return null
  const { avatarUrl } = currentUser
  return <View style={styles.postPrompt}>
    <TouchableOpacity onPress={newPost} style={styles.promptButton}>
      <Avatar avatarUrl={avatarUrl} style={styles.promptAvatar} />
      <Text style={styles.promptText}>{currentUser.firstName()}, what's on your mind?</Text>
    </TouchableOpacity>
  </View>
}
