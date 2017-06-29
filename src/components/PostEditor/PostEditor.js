import React from 'react'
import {
  Button,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import Editor from '../Editor'
import PropTypes from 'prop-types'
import styles from './PostEditor.styles'
import { get } from 'lodash/fp'

export default class PostEditor extends React.Component {
  static contextTypes = {navigate: PropTypes.func}

  constructor (props) {
    super(props)
    this.state = {
      title: get('title', props.post) || '',
      type: 'discussion'
    }
  }

  save = () => {
    return this.details.getContentAsync()
    .then(details => {
      const { post } = this.props
      if (post && post.id) {
        this.props.updatePost({
          ...post,
          title: this.state.title,
          details
        })
        .then(({ error }) => error || this.props.onSave())
      } else {
        // TODO create new post
      }
    })
  }

  render () {
    const { post } = this.props
    const { title, type } = this.state

    return <KeyboardAvoidingView style={styles.container} behavior='height'>
      <View style={styles.header}>
        <Button title='Save' onPress={this.save} />
      </View>
      <View style={styles.typeButtonRow}>
        {['discussion', 'request', 'offer'].map(t =>
          <TypeButton type={t} key={t} selected={t === type}
            onPress={() => this.setState({type: t})}/>)}
      </View>
      <View style={styles.titleWrapper}>
        <TextInput value={title} style={styles.title}
          onChangeText={title => this.setState({title})}
          placeholder={titlePlaceholders[type]} />
      </View>
      <Editor initialContent={post ? post.details : ''}
        ref={ref => { this.details = ref }} />
    </KeyboardAvoidingView>
  }
}

const titlePlaceholders = {
  discussion: 'What do you want to discuss?',
  request: 'What do you need help with?',
  offer: 'How do you want to help?'
}

function TypeButton ({ type, selected, onPress }) {
  const s = styles.typeButton
  return <TouchableOpacity onPress={onPress}
    style={[s.box, selected && s[type].box]}>
    <Text style={[s.text, selected && s[type].text]}>
      {type.toUpperCase()}
    </Text>
  </TouchableOpacity>
}
