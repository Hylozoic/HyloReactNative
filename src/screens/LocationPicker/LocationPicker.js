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
    searchTermFilter: searchTerm => searchTerm,
    fetchSearchSuggestions: (scope, searchTerm, providedProximity = '') => {
      const proximity = currentLocation?.coords
        ? `${currentLocation.coords.longitude},${currentLocation.coords.latitude}`
        : providedProximity

      return locationSearch(scope, searchTerm, proximity)
    }
  })
}
