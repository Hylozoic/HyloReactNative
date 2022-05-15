import { isObject } from 'lodash/fp'
import { locationSearch } from 'screens/LocationPicker/LocationPicker.store'
import LocationPickerItemRow from 'screens/LocationPicker/LocationPickerItemRow'

export default function LocationPicker ({
  screenTitle = 'Choose a Location',
  navigation,
  currentLocation,
  initialSearchTerm = '',
  onPick
}) {
  navigation.navigate('ItemChooser', {
    screenTitle,
    searchPlaceholder: 'Search for your location',
    initialSearchTerm,
    ItemRowComponent: LocationPickerItemRow,
    pickItem: onPick,
    searchTermFilter: searchTerm => {
      return isObject(searchTerm)
        ? searchTerm.fullText
        : searchTerm
    },
    fetchSearchSuggestions: (scope, searchTerm) => {
      const proximity = currentLocation?.coords &&
        `${currentLocation.coords.longitude},${currentLocation.coords.latitude}`

      return locationSearch(scope, searchTerm, proximity)
    }
  })
}
