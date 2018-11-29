import React from 'react'
import PropTypes from 'prop-types'
import { View, Alert } from 'react-native'
import { isEqual } from 'lodash/fp'
import header from 'util/header'
import ItemChooser from '../ItemChooser'

export default class ItemChooserScreen extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          screenTitle: PropTypes.string.isRequied,
          ItemRowComponent: PropTypes.func.isRequired,
          initialItems: PropTypes.array,
          updateItems: PropTypes.func.isRequired,
          searchPlaceholder: PropTypes.string.isRequired,
          fetchSearchSuggestions: PropTypes.func.isRequired,
          getSearchSuggestions: PropTypes.func.isRequired
        })
      })
    })
  }

  static navigationOptions = ({ navigation }) => {
    const screenTitle = navigation.getParam('screenTitle', undefined)
    const updateItems = navigation.getParam('updateItems', undefined)
    const initialItems = navigation.getParam('initialItems', undefined)
    const chosenItems = navigation.getParam('chosenItems', initialItems)
    const done = () => {
      updateItems(chosenItems)
      navigation.goBack()
    }
    const confirmLeave = onLeave => {
      const changed = !isEqual(chosenItems, initialItems)
      if (changed) {
        Alert.alert(
          'You have unsaved changes',
          'Are you sure you want to discard your changes?',
          [
            {text: 'Discard', onPress: onLeave},
            {text: 'Continue Editing', style: 'cancel'}
          ])
      } else {
        onLeave()
      }
    }

    return header(navigation, {
      title: screenTitle,
      headerBackButton: () => confirmLeave(navigation.goBack),
      right: {
        text: 'Done',
        onPress: done
      }
    })
  }

  updateItems = updatedItems =>
    this.props.navigation.setParams({ chosenItems: updatedItems })

  render () {
    return <ItemChooser
      {...this.props.navigation.state.params}
      updateItems={this.updateItems} />
  }
}
