import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-native'
import { isEqual } from 'lodash/fp'
import header from 'util/header'
import ItemChooser from '../ItemChooser'

export default class ItemChooserScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          updateItems: PropTypes.func,
          pickItem: PropTypes.func,
          screenTitle: PropTypes.string.isRequired,
          // Passed to ItemChooser
          initialItems: PropTypes.array,
          ItemRowComponent: PropTypes.func.isRequired,
          searchPlaceholder: PropTypes.string.isRequired,
          fetchSearchSuggestions: PropTypes.func.isRequired,
          getSearchSuggestions: PropTypes.func.isRequired,
          style: PropTypes.object
        })
      })
    })
  }

  static navigationOptions = ({ navigation }) => {
    const done = navigation.getParam('done', () => {})
    const cancel = navigation.getParam('cancel', () => {})
    const screenTitle = navigation.getParam('screenTitle')
    return header(navigation, {
      title: screenTitle,
      headerBackButton: cancel,
      right: {
        text: 'Done',
        onPress: done
      }
    })
  }

  constructor (props) {
    super(props)
    this.props.navigation.setParams({
      done: this.done,
      cancel: this.cancel,
      chosenItems: this.props.navigation.getParam('initialItems')
    })
  }

  cancel = () => {
    const { navigation } = this.props
    const { initialItems, chosenItems } = navigation.state.params
    const changed = !isEqual(chosenItems, initialItems)
    if (changed) {
      Alert.alert(
        'You have unsaved changes',
        'Are you sure you want to discard your changes?',
        [
          {text: 'Discard', onPress: navigation.goBack},
          {text: 'Continue Editing', style: 'cancel'}
        ])
    } else {
      navigation.goBack()
    }
  }

  done = () => {
    const { navigation } = this.props
    const { updateItems, chosenItems } = navigation.state.params
    updateItems && updateItems(chosenItems)
    navigation.goBack()
  }

  pickItem = pickedItem => {
    const { navigation } = this.props
    const { pickItem } = navigation.state.params
    pickItem(pickedItem)
    navigation.goBack()
  }

  updateItems = chosenItems =>
    this.props.navigation.setParams({ chosenItems })

  render () {
    return <ItemChooser
      {...this.props.navigation.state.params}
      pickItem={this.pickItem}
      updateItems={this.updateItems} />
  }
}
