import React from 'react'
import {
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import styles from './PostEditor.styles'
import { get } from 'lodash/fp'
import striptags from 'striptags'

export default class PostEditor extends React.Component {
  static contextTypes = {navigate: PropTypes.func}

  static navigationOptions = ({ navigation }) => {
    const { headerTitle, save } = get('state.params', navigation) || {}
    return {
      headerTitle,
      headerRight: save ? <Button title='Save' onPress={save} /> : null
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      title: get('title', props.post) || '',
      type: 'discussion'
    }
  }

  componentDidMount () {
    const { post, navigation, setDetails, save } = this.props
    setDetails(get('details', post))

    navigation.setParams({
      headerTitle: 'New Post', // TODO change for editing
      save: () => {
        const postData = {
          // TODO
        }
        return save(postData)
      }
    })
  }

  render () {
    const { details, editDetails } = this.props
    const { title, type } = this.state
    const detailsExcerpt = striptags(details).substring(0, 100)

    return <KeyboardAvoidingView style={styles.container} behavior='padding'
      keyboardVerticalOffset={64}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.scrollContent}>
          <SectionLabel>What are you posting today?</SectionLabel>
          <View style={[styles.typeButtonRow, styles.section]}>
            {['discussion', 'request', 'offer'].map(t =>
              <TypeButton type={t} key={t} selected={t === type}
                onPress={() => this.setState({type: t})} />)}
          </View>

          <SectionLabel>Title</SectionLabel>
          <View style={[styles.textInputWrapper, styles.section]}>
            <TextInput value={title} style={styles.textInput}
              onChangeText={title => this.setState({title})}
              placeholder={titlePlaceholders[type]} />
          </View>

          <SectionLabel>Details</SectionLabel>
          <TouchableOpacity style={[styles.textInputWrapper, styles.section]}
            onPress={editDetails}>
            <TextInput value={detailsExcerpt} style={styles.textInput}
              placeholder={detailsPlaceholder}
              editable={false} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  }
}

const titlePlaceholders = {
  discussion: 'What do you want to discuss?',
  request: 'What do you need help with?',
  offer: 'How do you want to help?'
}

const detailsPlaceholder = 'What else should we know?'

function SectionLabel ({ children }) {
  return <Text style={styles.sectionLabel}>
    {children}
  </Text>
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
