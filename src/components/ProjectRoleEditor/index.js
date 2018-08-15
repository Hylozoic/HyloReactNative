import React from 'react'
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native'

import Icon from '../Icon'
import styles from './Search.styles'

export default class ProjectRoleEditor extends React.Component {
  componentWillUnmount () {
    const emptyString = ''
    this.props.updateSearch(emptyString)
  }

  render () {
    const { style, type, results, onSelect, updateSearch, onCancel } = this.props

    const renderItem = ({ item }) =>
      <SearchResult item={item} type={type} onPress={() => onSelect(item)} />

    return <ScrollView keyboardShouldPersistTaps='handled'
      contentContainerStyle={[styles.container, style]}>
      <View style={styles.inputWrapper}>
        <Text>Roles</Text>
      </View>
    </ScrollView>
  }
}
