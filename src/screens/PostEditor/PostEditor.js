import React, { useState } from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from 'react-native'
import { get, uniq, uniqBy, isEmpty, capitalize } from 'lodash/fp'
import moment from 'moment'
import { validateTopicName } from 'hylo-utils/validators'
import { rhino30 } from 'style/colors'
import { showToast, hideToast } from 'util/toast'
import { buildModalScreenOptions } from 'navigation/header'
import { MAX_TITLE_LENGTH } from './PostEditor.store'
import RNPickerSelect from 'react-native-picker-select'
import LocationPicker from 'screens/LocationPicker/LocationPicker'
// TODO: Convert all 3 of the below to LocationPicker style calls
// ProjectMembers Chooser
import scopedFetchPeopleAutocomplete from 'store/actions/scopedFetchPeopleAutocomplete'
import scopedGetPeopleAutocomplete from 'store/selectors/scopedGetPeopleAutocomplete'
// Topics Picker
import fetchTopicsForGroupId from 'store/actions/fetchTopicsForGroupId'
import getTopicsForAutocompleteWithNew from 'store/selectors/getTopicsForAutocompleteWithNew'
import TopicRow from 'screens/TopicList/TopicRow'
// Group Chooser
import GroupChooserItemRow from 'screens/ItemChooser/GroupChooserItemRow'
import GroupsList from 'components/GroupsList'

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
import ItemChooserItemRow from 'screens/ItemChooser/ItemChooserItemRow'

export default class PostEditor extends React.Component {
  constructor (props) {
    super(props)
    const { post, imageUrls, fileUrls } = props
    this.scrollView = React.createRef()
    this.state = {
      scrollViewHeight: 0,
      title: get('title', post) || '',
      type: get('type', post) || 'discussion',
      groups: get('groups', post) || [],
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
    const { navigation, isNewPost } = this.props
    const subject = capitalize(this.state?.type || '')
    const headerTitle = isNewPost
      ? `New ${subject}`
      : `Edit ${subject}`
    const headerRightButtonLabel = isSaving
      ? 'Saving...'
      : isNewPost
        ? 'Post'
        : 'Save'

    navigation.setOptions(buildModalScreenOptions({
      headerTitle,
      headerLeftConfirm: true,
      headerRightButtonLabel,
      headerRightButtonOnPress: this.save,
      headerRightButtonDisabled: isSaving
    }))
  }

  componentDidMount () {
    const { isNewPost } = this.props
    if (!isNewPost) {
      this.props.fetchPost()
    }
    this.setHeader()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.isFocused
  }

  handleDetailsOnChange = (detailsText) => {
    this.setState({ detailsText })
  }

  handleTypeOnChange = type => {
    !this.state.isSaving && this.setState({ type }, this.setHeader)
  }

  setIsSaving = isSaving => {
    this.setState({ isSaving }, this.setHeader)
  }

  _doSave = () => {
    const { save } = this.props
    const {
      fileUrls, imageUrls, title, detailsText,
      topics, type, announcementEnabled, members,
      groups, startTime, endTime, location,
      locationObject
    } = this.state
    const postData = {
      type,
      details: toHtml(detailsText),
      groups,
      memberIds: members.map(m => m.id),
      fileUrls,
      imageUrls,
      title,
      sendAnnouncement: announcementEnabled,
      topicNames: topics.map(t => t.name),
      startTime: startTime && startTime.getTime(),
      endTime: endTime && endTime.getTime(),
      location: location,
      locationId: locationObject && locationObject.id !== 'NEW' && locationObject.id
    }

    return save(postData)
      .catch(e => { this.setIsSaving(false) })
  }

  save = () => {
    const { announcementEnabled } = this.state

    this.setIsSaving(true)

    if (announcementEnabled) {
      Alert.alert(
        'MAKE AN ANNOUNCEMENT',
        'This means that all members of this group will receive an instant email and push notification about this Post. \n(This feature is available to moderators only.)',
        [
          { text: 'Send It', onPress: this._doSave },
          {
            text: 'Go Back',
            style: 'cancel',
            onPress: () => this.setIsSaving(false)
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

  addGroup = group => {
    this.setState(state => ({
      groups: uniqBy(
        c => c.id,
        [...this.state.groups, group]
      )
    }))
  }

  removeGroup = groupId => {
    this.setState(state => ({
      groups: this.state.groups.filter(c => c.id !== groupId)
    }))
  }

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
  // TODO: support topics from more than one group, for crossposting
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
    navigation.navigate('ItemChooser', {
      screenTitle,
      searchPlaceholder: 'Type in the names of people to add to project',
      ItemRowComponent: ItemChooserItemRow,
      initialItems: members,
      updateItems: this.updateMembers,
      fetchSearchSuggestions: scopedFetchPeopleAutocomplete,
      getSearchSuggestions: scopedGetPeopleAutocomplete(screenTitle)
    })
  }

  showTopicsPicker = () => {
    const { navigation } = this.props
    const screenTitle = 'Pick a Topic'
    navigation.navigate('ItemChooser', {
      screenTitle,
      searchPlaceholder: 'Search for a topic by name',
      ItemRowComponent: TopicRow,
      pickItem: this.insertTopicFromPicker,
      // FIX: Will only find topics for first group
      fetchSearchSuggestions: fetchTopicsForGroupId(get('[0].id', this.state.groups)),
      getSearchSuggestions: getTopicsForAutocompleteWithNew
    })
  }

  showGroupsEditor = () => {
    const { navigation, groupOptions } = this.props
    const screenTitle = 'Post in Groups'
    navigation.navigate('ItemChooser', {
      screenTitle,
      searchPlaceholder: 'Search for group by name',
      defaultSuggestedItemsLabel: 'Your Groups',
      defaultSuggestedItems: groupOptions,
      ItemRowComponent: GroupChooserItemRow,
      pickItem: this.addGroup,
      fetchSearchSuggestions: () => ({ type: 'none' }),
      getSearchSuggestions: (_, { autocomplete: searchTerm }) =>
        groupOptions.filter(c => c.name.match(searchTerm))
    })
  }

  showLocationPicker = () => {
    LocationPicker({
      navigation: this.props.navigation,      
      initialSearchTerm: get('location', this.state) ||
        get('locationObject.fullText', this.state),
      onPick: (locationObject) => this.setState(() =>
        ({ location: locationObject.fullText, locationObject }))
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
    const { currentGroup, canModerate, post, pendingDetailsText } = this.props
    const {
      fileUrls, imageUrls, isSaving, topics, title, detailsText, type,
      filePickerPending, imagePickerPending, announcementEnabled,
      detailsFocused, titleLengthError, members, groups,
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
    const isProject = type == 'project'

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
            <View style={[styles.typeSelector.row, styles.section, { marginTop: -3 }]}>
              {/* <Text style={styles.sectionLabel}>What are you posting today?</Text> */}
              <TypeSelector value={type} onValueChange={this.handleTypeOnChange} disabled={isSaving} />
            </View>
            <Text style={styles.sectionLabel}>Title</Text>
            <View style={[styles.section, styles.textInputWrapper]}>
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
              groupId={get('id', currentGroup)}
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
              <TouchableOpacity style={[styles.section, styles.textInputWrapper]} onPress={this.showProjectMembersEditor}>
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
                onPress={this.showLocationPicker}
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
              onPress={this.showGroupsEditor}
            >
              <View style={styles.topicLabel}>
                <Text style={styles.sectionLabel}>Post In</Text>
                <View style={styles.topicAddBorder}><Icon name='Plus' style={styles.topicAdd} /></View>
              </View>
              <GroupsList
                groups={groups}
                columns={1}
                onPress={this.removeGroup}
                RightIcon={iconProps =>
                  <Icon name='Ex' style={styles.groupRemoveIcon} {...iconProps} />}
              />
              {groups.length < 1 &&
                <Text style={styles.textInputPlaceholder}>Select which groups to post in.</Text>}
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

export function TypeSelector (props) {
  return (
    <RNPickerSelect {...props}
      style={styles.typeSelector[props.value]}
      useNativeAndroidPickerStyle={false}
      items={[
          { label: 'Discussion'.toUpperCase(), value: 'discussion',
            color: styles.typeSelector['discussion'].inputIOS.color },
          { label: 'Event'.toUpperCase(), value: 'event',
            color: styles.typeSelector['event'].inputIOS.color },
          { label: 'Offer'.toUpperCase(), value: 'offer',
            color: styles.typeSelector['offer'].inputIOS.color },
          { label: 'Resource'.toUpperCase(), value: 'resource',
            color: styles.typeSelector['resource'].inputIOS.color },
          { label: 'Project'.toUpperCase(), value: 'project',
            color: styles.typeSelector['project'].inputIOS.color },
          { label: 'Request'.toUpperCase(), value: 'request',
            color: styles.typeSelector['request'].inputIOS.color }
      ]}
      Icon={() => <Icon name='ArrowDown' style={styles.typeSelector.icon} />}
    />
  )
}

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

export function Groups ({ onPress, groups, placeholder }) {
  if (groups.length > 0) {
    return groups.map((group, index) =>
      <TouchableOpacity onPress={onPress} style={styles.topicPill}>
        <Text style={styles.topicText}>#{group.name}</Text>
        <Icon name='Ex' style={styles.removeGroup} />
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
      {expanded && (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <DatePicker
            date={date}
            minimumDate={minimumDate}
            onChange={onChange}
          />
        </View>
      )}
    </TouchableOpacity>
  )
}
