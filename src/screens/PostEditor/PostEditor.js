import React, { useState } from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from 'react-native'
import { get, uniq, uniqBy, isEmpty } from 'lodash/fp'
import moment from 'moment'
import { validateTopicName } from 'hylo-utils/validators'
import { rhino30 } from 'style/colors'
import { showToast, hideToast } from 'util/toast'
import { buildModalScreenOptions } from 'navigation/header'
import { MAX_TITLE_LENGTH } from './PostEditor.store'
// ProjectMembers Chooser
import scopedFetchPeopleAutocomplete from 'store/actions/scopedFetchPeopleAutocomplete'
import scopedGetPeopleAutocomplete from 'store/selectors/scopedGetPeopleAutocomplete'
import ProjectMemberItemRow from 'screens/ItemChooser/ProjectMemberItemRow'
// Topics Picker
import fetchTopicsForCommunityId from 'store/actions/fetchTopicsForCommunityId'
import getTopicsForAutocompleteWithNew from 'store/selectors/getTopicsForAutocompleteWithNew'
import TopicRow from 'screens/TopicList/TopicRow'
// Community Chooser
import CommunityChooserItemRow from 'screens/ItemChooser/CommunityChooserItemRow'
// Location Picker
import { locationSearch } from 'screens/ItemChooser/ItemChooser.store'
import LocationPickerItemRow from 'screens/ItemChooser/LocationPickerItemRow'
//
import CommunitiesList from 'components/CommunitiesList'
import ProjectMembersSummary from 'components/ProjectMembersSummary'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import Icon from 'components/Icon'
import FileSelector, { showFilePicker } from './FileSelector'
import DatePicker from 'components/DatePicker'
import { showImagePicker } from 'components/ImagePicker'
import ImageSelector from './ImageSelector'
import InlineEditor, { toHtml } from 'components/InlineEditor'
import ErrorBubble from 'components/ErrorBubble'
import styles from './PostEditor.styles'

export default class PostEditor extends React.Component {
  constructor (props) {
    super(props)
    const { post, imageUrls, fileUrls, isProject } = props
    this.scrollView = React.createRef()
    this.state = {
      scrollViewHeight: 0,
      title: get('title', post) || '',
      type: get('type', post) || (isProject ? 'project' : 'discussion'),
      communities: get('communities', post) || [],
      imageUrls,
      fileUrls,
      topics: get('topics', post) || [],
      members: get('members', post) || [],
      topicsPicked: false,
      announcementEnabled: false,
      detailsFocused: false,
      detailsText: get('detailsText', post) || '',
      titleLengthError: false,
      startTime: get('startTime', post) ? (new Date(get('startTime', post))) : null,
      endTime: get('endTime', post) ? (new Date(get('endTime', post))) : null,
      location: get('location', post),
      locationObject: get('locationObject', post),
      startTimeExpanded: false,
      endTimeExpanded: false,
      isSaving: false
    }
  }

  setHeader = () => {
    const { isSaving } = this.state
    const { navigation, isNewPost, isProject } = this.props
    const subject = isProject
      ? 'Project'
      : 'Post'
    const headerTitle = isNewPost
      ? `New ${subject}`
      : `Edit ${subject}`
    navigation.setOptions(buildModalScreenOptions({
      headerTitle,
      headerLeftConfirm: true,
      headerRightButtonLabel: isSaving
        ? 'Saving...'
        : 'Save',
      headerRightButtonOnPress: this.save,
      headerRightButtonDisabled: isSaving
    }))
  }

  componentDidMount () {
    const { navigation, isNewPost, pollingFindOrCreateLocation } = this.props
    // For Location Selector
    navigation.setParams({ pollingFindOrCreateLocation })
    if (!isNewPost) {
      this.props.fetchPost()
    }
    this.setHeader()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.isSaving !== this.state.isSaving) {
      this.setHeader()
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.isFocused
  }

  handleDetailsOnChange = (detailsText) => {
    this.setState({ detailsText })
  }

  _doSave = () => {
    const { navigation, save } = this.props
    const {
      fileUrls, imageUrls, title, detailsText,
      topics, type, announcementEnabled, members,
      communities, startTime, endTime, location,
      locationObject
    } = this.state
    const postData = {
      type,
      details: toHtml(detailsText),
      communities,
      memberIds: members.map(m => m.id),
      fileUrls,
      imageUrls,
      title,
      sendAnnouncement: announcementEnabled,
      topicNames: topics.map(t => t.name),
      startTime: startTime && startTime.getTime(),
      endTime: endTime && endTime.getTime(),
      location: location,
      locationId: locationObject && locationObject.id
    }

    return save(postData)
      .catch(e => {
        this.setState({ isSaving: false })
      })
  }

  save = () => {
    const { announcementEnabled } = this.state

    this.setState({ isSaving: true })

    if (announcementEnabled) {
      Alert.alert(
        'MAKE AN ANNOUNCEMENT',
        'This means that all members of this community will receive an instant email and push notification about this Post. \n(This feature is available to moderators only.)',
        [
          { text: 'Send It', onPress: this._doSave },
          {
            text: 'Go Back',
            style: 'cancel',
            onPress: () => this.setState({ isSaving: false })
          }
        ])
    } else {
      this._doSave()
    }
  }

  addImage = ({ local, remote }) => {
    // TODO: use `local` to avoid unnecessary network activity
    this.setState({
      imageUrls: uniq(this.state.imageUrls.concat(remote))
    })
  }

  removeImage = url => {
    this.setState({
      imageUrls: this.state.imageUrls.filter(u => u !== url)
    })
  }

  addFile = ({ local, remote }) => {
    this.setState({
      fileUrls: uniq(this.state.fileUrls.concat(remote))
    })
  }

  addCommunity = community => {
    this.setState(state => ({
      communities: uniqBy(
        c => c.id,
        [...this.state.communities, community]
      )
    }))
  }

  removeCommunity = communityId => {
    this.setState(state => ({
      communities: this.state.communities.filter(c => c.id !== communityId)
    }))
  }

  setLocation = locationData => {
    const pollingFindOrCreateLocation = this.props.route.params.pollingFindOrCreateLocation
    const isPlainTextResult = (get('id', locationData) === 'NEW')

    if (isPlainTextResult) {
      this.setState(() => ({ location: locationData.fullText }))
    } else {
      this.setState(() => ({ location: null }))
      pollingFindOrCreateLocation(
        locationData,
        locationObject => this.setState(() => ({ locationObject })
        ))
    }
  }

  removeLocation = () => this.setState(state => ({ locationObject: null }))

  removeFile = url => {
    this.setState({
      fileUrls: this.state.fileUrls.filter(u => u !== url)
    })
  }

  showAlert = (msg) => Alert.alert(msg)

  ignoreHash = name => name[0] === '#' ? name.slice(1) : name

  insertTopicFromPicker = topic => {
    const t = { ...topic, name: this.ignoreHash(topic.name) }

    if (validateTopicName(t.name) === null) this.insertUniqueTopics([t], true)
  }

  insertEditorTopic = topics => {
    // If topic picker has been used, don't override it with the details editor
    if (this.state.topicsPicked) return

    const validTopics = topics.filter(({ name }) => validateTopicName(name) === null)
    this.insertUniqueTopics(validTopics, false)
  }

  // Assumptions:
  //  - a maximum of three topics per post are allowed
  //  - topics must be unique
  //  - priority is given to topics already on the post (preserve order)
  // TODO: support topics from more than one community, for crossposting
  insertUniqueTopics = (topicCandidates, topicsPicked) => {
    const topics = uniqBy(
      t => t.name,
      [...this.state.topics, ...topicCandidates]
    ).slice(0, 3)
    this.setState({ topics, topicsPicked })
  }

  removeTopic = topicName => () => this.setState({
    topics: this.state.topics.filter(t => t !== topicName),
    topicsPicked: true
  })

  toggleAnnoucement = () => {
    this.toast && hideToast(this.toast)
    this.toast = showToast(`announcement ${!this.state.announcementEnabled ? 'on' : 'off'}`, { isError: this.state.announcementEnabled })
    this.setState({ announcementEnabled: !this.state.announcementEnabled })
  }

  updateTitle = (title) => {
    switch (title.length >= MAX_TITLE_LENGTH) {
      case true:
        this.setState({ titleLengthError: true })
        break
      case false:
        this.setState({ titleLengthError: false })
        this.setState({ title })
        break
    }
  }

  updateMembers = members => this.setState(state => ({ members }))

  removeMember = member => () => {
    const { members } = this.state
    this.updateMembers(members.filter(m => m.id !== member.id))
  }

  onContentSizeChange = (width, height) => {
    this.setState({ scrollViewHeight: height })
  }

  onDatePickerExpand = () => {
    this.scrollView.current.scrollToEnd()
  }

  showProjectMembersEditor = () => {
    const { navigation } = this.props
    const { members } = this.state
    const screenTitle = 'Project Members'
    navigation.navigate('ItemChooserScreen', {
      screenTitle,
      searchPlaceholder: 'Type in the names of people to add to project',
      ItemRowComponent: ProjectMemberItemRow,
      initialItems: members,
      updateItems: this.updateMembers,
      fetchSearchSuggestions: scopedFetchPeopleAutocomplete,
      getSearchSuggestions: scopedGetPeopleAutocomplete(screenTitle)
    })
  }

  showTopicsPicker = () => {
    const { navigation } = this.props
    const screenTitle = 'Pick a Topic'
    navigation.navigate('ItemChooserScreen', {
      screenTitle,
      searchPlaceholder: 'Search for a topic by name',
      ItemRowComponent: TopicRow,
      pickItem: this.insertTopicFromPicker,
      // FIX: Will only find topics for first community
      fetchSearchSuggestions: fetchTopicsForCommunityId(get('[0].id', this.state.communities)),
      getSearchSuggestions: getTopicsForAutocompleteWithNew
    })
  }

  showCommunitiesEditor = () => {
    const { navigation, communityOptions } = this.props
    const screenTitle = 'Post in Communities'
    navigation.navigate('ItemChooserScreen', {
      screenTitle,
      searchPlaceholder: 'Search for community by name',
      defaultSuggestedItemsLabel: 'Your Communities',
      defaultSuggestedItems: communityOptions,
      ItemRowComponent: CommunityChooserItemRow,
      pickItem: this.addCommunity,
      fetchSearchSuggestions: () => ({ type: 'none' }),
      getSearchSuggestions: (_, { autocomplete: searchTerm }) =>
        communityOptions.filter(c => c.name.match(searchTerm))
    })
  }

  showLocationEditor = () => {
    const { navigation } = this.props
    const screenTitle = 'Choose a Location'
    const initialSearchTerm = get('location', this.state) || get('locationObject.fullText', this.state)
    // TODO: Get current location to send as proximity for location search
    // const curLocation = locationObject || get('0.locationObject', communities) || get('locationObject', currentUser)
    navigation.navigate('ItemChooserScreen', {
      screenTitle,
      searchPlaceholder: 'Search for your location',
      initialSearchTerm,
      ItemRowComponent: LocationPickerItemRow,
      pickItem: this.setLocation,
      searchTermFilter: searchTerm => searchTerm,
      fetchSearchSuggestions: locationSearch
    })
  }

  showFilePicker = () => {
    this.setState({ filePickerPending: true })
    showFilePicker({
      upload: this.props.upload,
      type: 'post',
      id: get('post.id', this.props),
      onAdd: this.addFile,
      onError: this.showAlert,
      onComplete: () => this.setState({ filePickerPending: false })
    })
  }

  showImagePicker = () => {
    this.setState({ imagePickerPending: true })
    showImagePicker({
      upload: this.props.upload,
      type: 'post',
      id: get('post.id', this.props),
      onChoice: this.addImage,
      onError: this.showAlert,
      onCancel: () => this.setState({ imagePickerPending: false }),
      onComplete: () => this.setState({ imagePickerPending: false })
    })
  }

  render () {
    const { currentCommunity, canModerate, post, pendingDetailsText, isProject } = this.props
    const {
      fileUrls, imageUrls, isSaving, topics, title, detailsText, type,
      filePickerPending, imagePickerPending, announcementEnabled,
      detailsFocused, titleLengthError, members, communities,
      startTime, endTime, location, locationObject
    } = this.state
    const canHaveTimeframe = type !== 'discussion'
    const canHaveLocation = type !== 'discussion'
    const toolbarProps = {
      post,
      canModerate,
      filePickerPending,
      imagePickerPending,
      announcementEnabled,
      toggleAnnoucement: this.toggleAnnoucement,
      showImagePicker: this.showImagePicker,
      showFilePicker: this.showFilePicker
    }

    return (
      <KeyboardFriendlyView style={styles.container}>
        <ScrollView
          ref={this.scrollView}
          keyboardShouldPersistTaps='handled'
          style={styles.scrollContainer}
          onContentSizeChange={this.onContentSizeChange}
          keyboardDismissMode='on-drag'
        >
          <View style={styles.scrollContent}>
            {!isProject && <>
              <Text style={styles.sectionLabel}>What are you posting today?</Text>
              <View style={[styles.typeButtonRow, styles.section]}>
                {['discussion', 'request', 'offer', 'resource'].map(t => (
                  <TypeButton
                    type={t} key={t} selected={t === type}
                    onPress={() => !isSaving && this.setState({ type: t })}
                  />
                ))}
              </View>
            </>}
            <Text style={styles.sectionLabel}>Title</Text>
            <View style={[ styles.section, styles.textInputWrapper ]}>
              <TextInput
                style={styles.textInput}
                editable={!isSaving}
                onChangeText={this.updateTitle}
                placeholder={titlePlaceholders[type]}
                placeholderTextColor={rhino30}
                underlineColorAndroid='transparent'
                value={title}
                maxLength={MAX_TITLE_LENGTH}
              />
            </View>
            {titleLengthError && (
              <View style={styles.errorView}>
                <ErrorBubble
                  customStyles={styles.errorBubble}
                  errorRowStyle={styles.errorRow} text={`Title can't have more than ${MAX_TITLE_LENGTH} characters.`}
                  topRightArrow
                />
              </View>
            )}
            <Text style={styles.sectionLabel}>Details</Text>
            <InlineEditor
              style={[
                styles.section,
                styles.textInputWrapper
              ]}
              inputStyle={styles.textInput}
              onChange={this.handleDetailsOnChange}
              value={detailsText}
              editable={!pendingDetailsText}
              submitting={isSaving}
              placeholder={detailsPlaceholder}
              communityId={get('id', currentCommunity)}
              autoGrow={false}
              onFocusToggle={isFocused => this.setState({ detailsFocused: isFocused })}
              onInsertTopic={this.insertEditorTopic}
            />

            <TouchableOpacity
              style={[
                styles.section,
                styles.textInputWrapper,
                styles.topics
              ]}
              onPress={this.showTopicsPicker}
            >
              <View style={styles.topicLabel}>
                <Text style={styles.sectionLabel}>Topics</Text>
                <View style={styles.topicAddBorder}><Icon name='Plus' style={styles.topicAdd} /></View>
              </View>
              <Topics onPress={this.removeTopic} topics={topics} />
              {topics.length < 1 &&
                <Text style={styles.textInputPlaceholder}>{topicsPlaceholder}</Text>}
            </TouchableOpacity>

            {isProject && (
              <TouchableOpacity style={[ styles.section, styles.textInputWrapper ]} onPress={this.showProjectMembersEditor}>
                <View style={styles.topicLabel}>
                  <Text style={styles.sectionLabel}>Members</Text>
                  <View style={styles.topicAddBorder}><Icon name='Plus' style={styles.topicAdd} /></View>
                </View>
                {members.length > 0 &&
                  <ProjectMembersSummary members={members} />}
                {members.length < 1 &&
                  <Text style={styles.textInputPlaceholder}>Who is a part of this project?</Text>}
              </TouchableOpacity>
            )}

            {canHaveTimeframe && (
              <>
                <DatePickerWithLabel
                  label='Start Time'
                  placeholder='When does it start?'
                  date={startTime}
                  minimumDate={new Date()}
                  onChange={date => this.setState({ startTime: date })}
                  onExpand={this.onDatePickerExpand}
                />
                <DatePickerWithLabel
                  label='End Time'
                  placeholder='When does it end?'
                  date={endTime}
                  minimumDate={startTime || new Date()}
                  onChange={date => this.setState({ endTime: date })}
                  onExpand={this.onDatePickerExpand}
                />
              </>
            )}
            {canHaveLocation && (
              <TouchableOpacity
                style={[
                  styles.section,
                  styles.textInputWrapper,
                  styles.topics
                ]}
                onPress={this.showLocationEditor}
              >
                <View style={styles.topicLabel}>
                  <Text style={styles.sectionLabel}>Location</Text>
                  <View style={styles.topicAddBorder}><Icon name='Plus' style={styles.topicAdd} /></View>
                </View>
                {!location && !locationObject && <Text style={styles.textInputPlaceholder}>Select a Location</Text>}
                {(location || locationObject) && <Text>{location || locationObject.fullText}</Text>}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.section,
                styles.textInputWrapper
              ]}
              onPress={this.showCommunitiesEditor}
            >
              <View style={styles.topicLabel}>
                <Text style={styles.sectionLabel}>Post In</Text>
                <View style={styles.topicAddBorder}><Icon name='Plus' style={styles.topicAdd} /></View>
              </View>
              <CommunitiesList
                communities={communities}
                columns={1}
                onPress={this.removeCommunity}
                RightIcon={iconProps =>
                  <Icon name='Ex' style={styles.communityRemoveIcon} {...iconProps} />}
              />
              {communities.length < 1 &&
                <Text style={styles.textInputPlaceholder}>Select which communities to post in.</Text>}
            </TouchableOpacity>

            {!isEmpty(imageUrls) && (
              <View>
                <Text style={styles.sectionLabel}>Images</Text>
                <ImageSelector
                  onAdd={this.addImage}
                  onRemove={this.removeImage}
                  imageUrls={imageUrls}
                  style={styles.imageSelector}
                  type='post'
                />
              </View>
            )}

            {!isEmpty(fileUrls) && (
              <View>
                <Text style={styles.sectionLabel}>Files</Text>
                <FileSelector
                  onRemove={this.removeFile}
                  fileUrls={fileUrls}
                />
              </View>
            )}

            {detailsFocused && <Toolbar {...toolbarProps} />}
          </View>
        </ScrollView>
        {!detailsFocused && <Toolbar {...toolbarProps} />}
      </KeyboardFriendlyView>
    )
  }
}

const titlePlaceholders = {
  discussion: 'What do you want to discuss?',
  request: 'What do you need help with?',
  offer: 'How do you want to help?',
  resource: 'What resource is available?',
  project: 'What is your project called?'
}

const detailsPlaceholder = 'What else should we know?'

const topicsPlaceholder = 'Add topics.'

export function Toolbar ({ post, canModerate, filePickerPending, imagePickerPending, announcementEnabled, toggleAnnoucement, showFilePicker, showImagePicker }) {
  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarIcons}>
        <TouchableOpacity onPress={showFilePicker}><Icon name={filePickerPending ? 'Clock' : 'Paperclip'} style={styles.bottomBarIcon} /></TouchableOpacity>
        <TouchableOpacity onPress={showImagePicker}><Icon name={imagePickerPending ? 'Clock' : 'AddImage'} style={styles.bottomBarIcon} /></TouchableOpacity>
        {isEmpty(post) && canModerate && <TouchableOpacity onPress={toggleAnnoucement}><Icon name='Announcement' style={styles.annoucementIcon} color={announcementEnabled ? 'caribbeanGreen' : 'rhino30'} /></TouchableOpacity>}
      </View>
    </View>
  )
}

export function Communities ({ onPress, communities, placeholder }) {
  if (communities.length > 0) {
    return communities.map((community, index) =>
      <TouchableOpacity onPress={onPress} style={styles.topicPill}>
        <Text style={styles.topicText}>#{community.name}</Text>
        <Icon name='Ex' style={styles.removeCommunity} />
      </TouchableOpacity>
    )
  }
  return <Text style={styles.textInputPlaceholder}>{placeholder}</Text>
}

export function Topics ({ onPress, topics, placeholder }) {
  if (topics.length < 1) return null
  return (
    <ScrollView horizontal style={styles.topicPillBox}>
      {topics.map((t, i) => <TopicPill key={i} topic={t} onPress={onPress(t)} />)}
    </ScrollView>
  )
}

export function TopicPill ({ topic, topic: { name }, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.topicPill}>
      <Text style={styles.topicText}>#{name.toLowerCase()}</Text>
      <Icon name='Ex' style={styles.topicRemove} />
    </TouchableOpacity>
  )
}

export function TypeButton ({ type, selected, onPress }) {
  const s = styles.typeButton
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.box, selected && s[type].box]}
    >
      <Text style={[s.text, selected && s[type].text]}>
        {type.toUpperCase()}
      </Text>
    </TouchableOpacity>
  )
}

export function DatePickerWithLabel ({
  date,
  minimumDate,
  label,
  placeholder,
  expanded: initialExpanded = false,
  onChange,
  onExpand,
  styleTemplate = {
    wrapper: [
      styles.section,
      styles.textInputWrapper
    ],
    labelWrapper: styles.topicLabel,
    labelText: styles.sectionLabel,
    expandIconWrapper: styles.topicAddBorder,
    expandIcon: styles.topicAdd,
    valueText: {},
    placeholderText: styles.textInputPlaceholder
  },
  dateFormat = 'MM/DD/YYYY LT'
}) {
  const [expanded, setExpanded] = useState(initialExpanded)
  const onPress = () => {
    if (!expanded) onExpand()
    setExpanded(!expanded)
  }

  return (
    <TouchableOpacity
      style={styleTemplate.wrapper}
      onPress={onPress}
    >
      <View style={styleTemplate.labelWrapper}>
        <Text style={styleTemplate.labelText}>
          {label}
        </Text>
        <View style={styleTemplate.expandIconWrapper}>
          <Icon name={expanded ? 'ArrowUp' : 'ArrowDown'} style={styleTemplate.expandIcon} />
        </View>
      </View>
      {date && !expanded &&
        <Text style={styleTemplate.valueText}>{moment(date).format(dateFormat)}</Text>}
      {!date && !expanded &&
        <Text style={styleTemplate.placeholderText}>{placeholder}</Text>}
      {expanded && <View style={{ flex: 1, alignItems: 'center' }}>
        <DatePicker
          date={date}
          minimumDate={minimumDate}
          onChange={onChange}
        />
                   </View>}
    </TouchableOpacity>
  )
}
