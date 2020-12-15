import React from 'react'
import PropTypes from 'prop-types'
import { isEqual, isFunction } from 'lodash/fp'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import header from 'navigation/header'
import ItemChooser from 'navigation/ItemChooser'

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
          searchPlaceholder: PropTypes.string,
          fetchSearchSuggestions: PropTypes.func.isRequired,
          getSearchSuggestions: PropTypes.func,
          searchTermFilter: PropTypes.func,
          style: PropTypes.object
        })
      })
    })
  }

  static navigationOptions = ({ navigation, route }) => {
    const done = route.params.done || (() => {})
    const updateItems = route.params.updateItems
    const cancel = route.params.cancel || (() => {})
    const screenTitle = route.params.screenTitle
    const headerParams = {
      title: screenTitle,
      headerBackButton: cancel
    }
    if (isFunction(updateItems)) {
      headerParams.right = {
        text: 'Done',
        onPress: done
      }
    }
    return header(navigation, route, headerParams)
  }

  constructor (props) {
    super(props)
    this.props.navigation.setParams({
      done: this.done,
      cancel: this.cancel,
      chosenItems: this.props.route.params.initialItems
    })
  }

  cancel = () => {
    const { route, navigation } = this.props
    const { initialItems, chosenItems } = route.params
    const changed = !isEqual(chosenItems, initialItems)
    confirmDiscardChanges({
      hasChanges: changed,
      onDiscard: navigation.goBack
    })
  }

  done = () => {
    const { navigation } = this.props
    const { updateItems, chosenItems } = route.params
    updateItems && updateItems(chosenItems)
    navigation.goBack()
  }

  pickItem = pickedItem => {
    const { route, navigation } = this.props
    const { pickItem } = route.params
    pickItem(pickedItem)
    navigation.goBack()
  }

  updateItems = chosenItems =>
    this.props.navigation.setParams({ chosenItems })

  render () {
    const screenTitle = this.props.route.params.screenTitle
    const pickItem = this.props.route.params.pickItem
    const updateItems = this.props.route.params.updateItems

    return (
      <ItemChooser
        {...this.props.route.params}
        scope={screenTitle}
        pickItem={pickItem ? this.pickItem : undefined}
        updateItems={updateItems ? this.updateItems : undefined}
      />
    )
  }
}
