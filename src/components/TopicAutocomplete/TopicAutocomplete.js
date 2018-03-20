import React from 'react'
import { FlatList } from 'react-native'
import { string } from 'prop-types'
import styles from './TopicAutocomplete.styles'

export default class TopicAutocomplete extends React.PureComponent {
  static propTypes = {
    search: string
  }

  static defaultProps = {
    search: null
  }

  componentDidUpdate
  render () {
    const { search, topics } = this.props

    if (!search) return null

    return <FlatList
      scrollEnabled={false} />
  }
}
