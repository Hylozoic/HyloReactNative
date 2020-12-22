import React from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash/fp'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import ItemChooser from 'screens/ItemChooser'

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

  constructor (props) {
    super(props)
    this.props.navigation.setParams({
      done: this.done,
      cancel: this.cancel,
      chosenItems: this.props.route.params.initialItems
    })
  }

  setHeader = () => {
    const { navigation, route } = this.props
    const done = route.params.done || (() => {})
    const updateItems = route.params.updateItems
    const cancel = route.params.cancel || (() => {})
    const screenTitle = route.params.screenTitle
    const headerParams = {
      headerTitle: screenTitle,
      headerLeftOnPress: cancel
    }
    if (isFunction(updateItems)) {
      headerParams.headerRightButtonLabel = 'Done'
      headerParams.headerRightButtonOnPress = done
    }
    navigation.setOptions(
      buildModalScreenOptions(headerParams)
    )
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
    const { route, navigation } = this.props
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
    const { route } = this.props
    const screenTitle = route.params?.screenTitle
    const pickItem = route.params?.pickItem
    const updateItems = route.params?.updateItems

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
