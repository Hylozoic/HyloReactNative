import React from 'react'
import { Text, View } from 'react-native'
import { each, values } from 'lodash'
import { func, shape, string } from 'prop-types'

import styles from './PeopleTyping.styles'

// the amount to delay before deciding that someone is no longer typing
const MAX_TYPING_PAUSE = 5000

export default class PeopleTyping extends React.PureComponent {
  static propTypes = {
    clearUserTyping: func.isRequired,
    peopleTyping: shape({})
  }

  componentDidMount () {
    this.interval = setInterval(this.resetTyping.bind(this), 500)
  }

  resetTyping () {
    const { peopleTyping, clearUserTyping } = this.props
    each(peopleTyping, ({ timestamp }, id) =>
      Date.now() - timestamp > MAX_TYPING_PAUSE && clearUserTyping(id))
  }

  componentWillUnmount () {
    if (this.interval) clearInterval(this.interval)
  }

  render () {
    const names = values(this.props.peopleTyping).map(v => v.name)
    let message = ''
    if (names.length === 1) message = `${names[0]} is typing...`
    if (names.length > 1) message = 'Multiple people are typing...'

    return <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  }
}
